'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolSetup
 * @description
 * # txProtocolSetup
 */
angular.module('transcripticApp')
  .directive('txProtocolSetup', function ($rootScope, Auth, UUIDGen, Container, Omniprotocol, ContainerHelper) {
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
            _.assign(param, {name: name});
          }).
          filter(_.matches({canParameterize: true})).
          value();

        //containers
        self.containerColorOptions = ContainerHelper.definedColors;
        self.containerOptions      = ContainerHelper.containerOptions;
        self.storageOptions        = Omniprotocol.optionEnums.storage.storage;

        //this is set dynamically, reference should never be broken
        self.remoteContainers = ContainerHelper.remote;

        self.addParam = function (type) {
          self.parameters.push({
            id : UUIDGen(),
            type: type
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

        /* containers */

        self.selectNewContainer = function (param) {
          _.merge(param, {value: {
            isNew: true
          }});
          $scope.notifyContainerChange()
        };

        self.selectRemoteContainer = function (param, remote) {
          param.readable = remote.name || remote.id;
          _.assign(param.value, remote);
          $scope.notifyContainerChange();
        };

        self.handleChangeParamType = function (param) {
          self.clearParamValue(param);
          $scope.checkContainerChange();
        };

        self.handleSelectRemoteContainer = function (param, remote) {
          _.assign(param.value, remote);
          $scope.notifyContainerChange();
        };

      },
      link            : function postLink (scope, element, attrs) {
        var oldContainerLength;

        //CHANGE CHECKING / CONTAINERS

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
          _.forEach(scope.setupCtrl.parameters, function (param) {
            delete param.verification;
          });
        });

        scope.receiveVerifications = function (vers) {
          //todo - need to show verification for whole setup
          _.forEach(vers, function (ver) {
            _.assign(_.find(scope.setupCtrl.parameters, {name: ver.container}), {verification: ver});
          });
        };

        //init
        scope.checkContainerChange();
      }
    };
  });
