'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolSetup
 * @description
 * # txProtocolSetup
 */
angular.module('transcripticApp')
  .directive('txProtocolSetup', function ($rootScope, TranscripticAuth, UUIDGen, Container, Omniprotocol, ContainerHelper, ProtocolHelper) {
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
          self.parameters.push({
            id : UUIDGen(),
            type: param.type,
            readable: param.readable
          });
          $scope.showParameters = false;
        };

        self.addContainer = function (param) {
          var parameter = {
            id : UUIDGen(),
            type : 'container',
            value: {
              color: ContainerHelper.randomColor(),
              isNew: true
            }
          };

          if (_.isString(param)) {
            parameter.value.type = param;
          } else if (_.isObject(param)) {
            _.merge(parameter, param);
          }

          self.parameters.push(parameter);
          $scope.checkContainerChange();
        };

        self.clearParamValue = function (param) {
          _.assign(param, {value: null});
        };

        self.deleteParam = function (param) {
          _.remove(self.parameters, param);
          $scope.checkContainerChange();
        };

        self.handleChangeParamType = function (param) {
          self.clearParamValue(param);
          $scope.checkContainerChange();
        };

      },
      link            : function postLink (scope, element, attrs) {
        var oldContainerLength;

        //CHANGE CHECKING / CONTAINERS

        scope.$on('editor:toggleGroupVisibility', function (e, val) {
          scope.isVisible = !!val;
        });

        //todo - this will be problematic when handling verifications on the parameter b/c deep equality
        scope.$watch('setupCtrl.parameters', function (newval, oldval) {
          $rootScope.$broadcast('editor:parameterChange', newval);
        }, true);

        scope.checkContainerChange = function () {
          var containerList = _.filter(scope.setupCtrl.parameters, {type: 'container'});
          if (containerList.length != oldContainerLength) {
            ContainerHelper.setLocal(containerList);
            scope.notifyContainerChange();
            oldContainerLength = containerList.length;
          }
        };

        //mostly for tx-container-select
        scope.notifyContainerChange = function () {
          $rootScope.$broadcast('editor:containerChange');
        };

        scope.$on('editor:protocol:addContainer', function (event, param) {
          scope.setupCtrl.addContainer(param);
          scope.isVisible = true;
        });

        scope.$on('editor:newprotocol', function () {
          $rootScope.$broadcast('editor:parameterChange', scope.setupCtrl.parameters);
          scope.checkContainerChange()
        });

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
          //todo - shouldn't be binding to the parameter directly...
          //fixme - using index is a hack, should be using whole verification (can refactor once can remove the $watch on all parameters)
          _.forEach(vers, function (ver, verIndex) {
            _.assign(_.find(scope.setupCtrl.parameters, {name: ver.container}), {verification: verIndex});
          });
        };

        //init
        scope.checkContainerChange();
      }
    };
  });
