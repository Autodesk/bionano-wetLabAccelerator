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
 * @ngdoc function
 * @name wetLabAccelerator.controller:TestingRestyleCtrl
 * @description
 * # TestingRestyleCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('ProtocolCtrl', function ($scope, $http, ProtocolHelper) {
    var self = this;

    self.currentProtocol = ProtocolHelper.currentProtocol;

    self.loadDemo = function () {
      $http.get('demo_protocols/omniprotocol/protocol_dummy.json').success(function (d) {
        ProtocolHelper.assignCurrentProtocol(d);
      });
    };

    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };

    //self.loadDemo();
  });
