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

        //this is set dynamically, reference should never be broken
        self.remoteContainers = ContainerHelper.remote;

        self.selectNewContainer = function () {
          self.name = '';
          _.assign(self.model, {
            isNew: true,
            id : null,
            name : null
          });
        };

        self.selectRemoteContainer = function (remote) {
          self.name = remote.name || remote.id;
          _.assign(self.model, remote);
        };
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
