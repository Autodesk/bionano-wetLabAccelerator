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

        self.addParam = function () {
          self.parameters.push({});
        };

        self.clearParamValue = function (param) {
          param.value = null;
        };

        self.deleteParam = function (param) {
          _.remove(self.parameters, param);
        };

        /* containers */

        //this is set dynamically, reference should never be broken
        self.remoteContainers = ContainerHelper.remote;

        self.handleChangeParamType = function (param) {
          self.clearParamValue(param);
          self.checkContainerChange();
        };

        var oldContainerLength;
        self.checkContainerChange = function () {
          var containerParams = _.filter(self.parameters, {type: 'container'});
          if (oldContainerLength != containerParams.length) {
            ContainerHelper.setLocal(containerParams);
            self.notifyContainerChange();
          }
        };

        self.notifyContainerChange = function () {
          console.log('notify');
          $rootScope.$broadcast('editor:containerChange');
        };

      },
      link            : function postLink (scope, element, attrs) {
        //init
        scope.setupCtrl.checkContainerChange();
      }
    };
  });
