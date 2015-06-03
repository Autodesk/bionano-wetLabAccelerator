'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txContainerEditor
 * @description
 * # txContainerEditor
 */
angular.module('transcripticApp')
  .directive('txContainerEditor', function ($rootScope, ContainerHelper, Omniprotocol) {
    return {
      templateUrl: 'views/tx-container-editor.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        model : '=ngModel',
        name : '=containerName'
      },
      bindToController: true,
      controllerAs: 'contCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        //containers
        self.containerColorOptions = ContainerHelper.definedColors;
        self.containerOptions      = ContainerHelper.containerOptions;
        self.storageOptions        = Omniprotocol.optionEnums.storage.storage;

        self.selectNewContainer = function (param) {
          _.merge(param, {value: {
            isNew: true
          }});
          $scope.notifyContainerChange();
        };

        self.selectRemoteContainer = function (param, remote) {
          param.readable = remote.name || remote.id;
          _.assign(param.value, remote);
          $scope.notifyContainerChange();
        };

        //this is set dynamically, reference should never be broken
        self.remoteContainers = ContainerHelper.remote;

        self.handleSelectRemoteContainer = function (param, remote) {
          _.assign(param.value, remote);
          $scope.notifyContainerChange();
        };
      },
      link: function postLink(scope, element, attrs) {

        //mostly for tx-container-select
        scope.notifyContainerChange = function () {
          $rootScope.$broadcast('editor:containerChange');
        };

      }
    };
  });
