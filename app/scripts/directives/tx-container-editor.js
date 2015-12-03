/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txContainerEditor
 * @description
 * # txContainerEditor
 */
angular.module('wetLabAccelerator')
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

        self.toggleModal = function () {
          self.modalShow = !self.modalShow;
        }
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
