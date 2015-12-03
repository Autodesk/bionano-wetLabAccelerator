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
 * @name wetLabAccelerator.controller:ThermocyclegroupsctrlCtrl
 * @description
 * # ThermocyclegroupsctrlCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('thermocycleGroupsCtrl', function ($scope) {
    var self = this;

    //be sure to use ng-if on containing element for field values, since should only assume model is accurate when not using parameters

    self.addGroup = function () {
      self.groups.push({
        type : 'thermocycleGroup',
        value: {
          cycles : 1,
          steps: [{}]
        }
      });
    };

    self.deleteGroup = function (group) {
      _.remove(self.groups, group)
    };

    self.addStep = function (group) {
      group.steps.push({});
    };

    self.removeStep = function (group, step) {
      _.remove(group.steps, step);
    };

    self.onInit = function () {
      //note - hack - expects a fieldCtrl
      if (_.isEmpty($scope.fieldCtrl.model) && ! _.isArray($scope.fieldCtrl.model)) {
        $scope.fieldCtrl.model = [];
      }
      self.groups = $scope.fieldCtrl.model;
    };
  });
