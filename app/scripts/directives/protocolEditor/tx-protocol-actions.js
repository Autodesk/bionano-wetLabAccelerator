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
 * @name wetLabAccelerator.directive:txProtocolActions
 * @description
 * # txProtocolActions
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolActions', function ($rootScope, ProtocolHelper, Omniprotocol, Notify) {
    return {
      templateUrl: 'views/tx-protocol-actions.html',
      restrict: 'E',
      scope: {
        protocol: '=',
        protocolForm: '='
      },
      bindToController: true,
      controllerAs: 'actionCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        self.clearProtocol = _.partial(ProtocolHelper.clearProtocol, self.protocol);

        self.saveProtocol = function () {
          ProtocolHelper.saveProtocol(self.protocol)
            .then(self.protocolForm.$setPristine)
            .then(function () {
              Notify({
                message: 'Protocol Saved',
                error: false
              });
            });
        };

        $scope.modalShown = false;
        $scope.toggleModal = function() {
          $scope.modalShown = !$scope.modalShown;
        };

        self.autoprotocolConvertFunction = ProtocolHelper.convertToAutoprotocol;

      },
      link: function postLink(scope, element, attrs) {
        scope.$on('editor:toggleRunModal', function (event, forceState) {
          scope.modalShown = _.isUndefined(forceState) ? !scope.modalShown : !!forceState;
        });
      }
    };
  });
