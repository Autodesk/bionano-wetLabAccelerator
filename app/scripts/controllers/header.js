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
 * @name wetLabAccelerator.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('HeaderCtrl', function ($scope, $rootScope, $window, $location, Authentication) {

    var self = this;

    $scope.$on('$locationChangeSuccess', function () {
      self.currentPath = $location.path();
    });

    Authentication.watch(function (info) {
      self.currentAuth = (!!info) ? info : null;
    });

    self.unauthenticate = function () {
      Authentication.unauthenticate().then(function () {
        $window.location.href = '/logout';
      });
    };

    self.triggerCredentialsModal = function () {
      $rootScope.$broadcast('editor:toggleRunModal', true);
    }
  });
