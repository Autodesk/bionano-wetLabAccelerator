'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolSetup
 * @description
 * # txProtocolSetup
 */
angular.module('transcripticApp')
  .directive('txProtocolSetup', function ($rootScope, TranscripticAuth, UUIDGen, Container, Omniprotocol, ContainerHelper, ProtocolHelper, ProtocolUtils) {
    return {
      templateUrl     : 'views/tx-protocol-setup.html',
      restrict        : 'E',
      scope           : {
        parameters: '='
      },
      bindToController: true,
      controllerAs    : 'setupCtrl',
      controller      : function ($scope, $element, $attrs) {
        var self = this;

        //parameters
        this.paramTypes = _(Omniprotocol.inputTypes).
          forEach(function (param, name) {
            _.assign(param, {type: name});
          }).
          filter(_.matches({canParameterize: true})).
          groupBy('category').
          value();

        //containers
        self.containerColorOptions = ContainerHelper.definedColors;
        self.containerOptions      = ContainerHelper.containerOptions;
        self.storageOptions        = Omniprotocol.optionEnums.storage.storage;


        self.addParam = function (param) {
          ProtocolUtils.createParameter(param);
        };

        self.addContainer = function (param) {
          if (_.isString(param)) {
            console.warn('passed string to add container', param);
          }

          ProtocolUtils.createContainer(param);
        };

        self.clearParamValue = function (param) {
          ProtocolUtils.clearParameterValue(param);
        };

        self.deleteParam = function (param) {
          ProtocolUtils.deleteParameter(param);
        };

        self.handleChangeParamType = function (param) {
          self.clearParamValue(param);
        };

      },
      link            : function postLink (scope, element, attrs) {
        var oldContainerLength;

        scope.$on('editor:toggleSetupVisibility', function (e, val) {
          scope.isVisible = !!val;
        });

        scope.$on('editor:toggleGroupVisibility', function (e, val) {
          scope.isVisible = !!val;
        });

        //CHANGE CHECKING / CONTAINERS

        //todo - this will be problematic when handling verifications on the parameter b/c deep equality
        scope.$watch('setupCtrl.parameters', function (newval, oldval) {
          $rootScope.$broadcast('editor:parameterChange', newval);
          scope.checkContainerChange();
        }, true);

        scope.$on('editor:newprotocol', function () {
          $rootScope.$broadcast('editor:parameterChange', scope.setupCtrl.parameters);
          scope.checkContainerChange()
        });

        //check and update containerhelper
        //changes to containers themselves will be propagated by reference automatically
        //doens't really account for programmatic changes (i.e. within one digest) that are not picked up by the watch
        scope.checkContainerChange = function () {
          var containerList = _.filter(scope.setupCtrl.parameters, {type: 'container'});
          if (containerList.length != oldContainerLength) {
            ContainerHelper.setLocal(containerList);
            oldContainerLength = containerList.length;
          }
        };

        //VERIFICATIONS

        scope.$on('editor:verificationSuccess', function (event) {
          scope.hasVerifications = false;
          _.forEach(scope.setupCtrl.parameters, function (param) {
            delete param.verification;
          });
        });

        scope.receiveVerifications = function (vers) {
          scope.hasVerifications = !!vers.length;
          scope.verifications    = vers;
          //note, that this is not ideal, but bind verification to the parameter directly. we clear this later in pre-process in protocolHelper
          //note - need to bind by name, because verifications only know about container name, not id
          //fixme - using index is a hack, should be using whole verification (can refactor once can remove the $watch on all parameters, because really slow)
          _.forEach(vers, function (ver, verIndex) {
            _.assign(_.find(scope.setupCtrl.parameters, {name: ver.container}), {verification: verIndex});
          });
        };

        //init
        scope.checkContainerChange();
      }
    };
  });
