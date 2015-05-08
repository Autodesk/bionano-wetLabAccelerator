'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolSetup
 * @description
 * # txProtocolSetup
 */
angular.module('transcripticApp')
  .directive('txProtocolSetup', function ($rootScope, Auth, Container, Omniprotocol, ContainerHelper) {
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

        this.paramTypes       = Omniprotocol.inputTypes;
        this.containerOptions = Omniprotocol.optionEnums.containers;
        this.storageOptions   = _.union([false], Omniprotocol.optionEnums.storage.storage);

        self.addParam = function (type) {
          self.parameters.push({type:type});
          $scope.showParameters = false;
        };

        self.clearParamValue = function (param) {
          _.assign(param, {value : null});
        };

        self.deleteParam = function (param) {
          _.remove(self.parameters, param);
        };

        /* containers */

        //this is set dynamically, reference should never be broken
        self.remoteContainers = ContainerHelper.remote;

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

        scope.$watch('setupCtrl.parameters', function (newval, oldval) {
          $rootScope.$broadcast('editor:parameterChange', newval);
          if (_.every(newval, 'name') && _.every(newval, 'value')) {
            scope.paramDataEmpty = false;
          } else {
            scope.paramDataEmpty =  true;
          }
        }, true);

        scope.checkContainerChange = function () {
          var containerList = _.filter(scope.setupCtrl.parameters, {type : 'container'});
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

        //init
        scope.checkContainerChange();

        scope.$on('editor:newprotocol', scope.checkContainerChange);
      }
    };
  });
