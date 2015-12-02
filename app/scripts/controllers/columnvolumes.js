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
 * @name wetLabAccelerator.controller:ColumnvolumesctrlCtrl
 * @description
 * # ColumnvolumesctrlCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('columnVolumesCtrl', function ($scope) {
    var self = this;

    //be sure to use ng-if on containing element for field values, since should only assume model is accurate when not using parameters

    //todo - support more colors
    self.colors = [
      '#FF0000',
      '#0000FF',
      '#00FF00',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF',
      '#FFFFFF'
    ];

    self.activateGroup = function (index) {
      self.colvolActive = index;
    };

    self.onInit = function () {
      //note - hack - expects a fieldCtrl
      if (_.isEmpty($scope.fieldCtrl.model) && ! _.isArray($scope.fieldCtrl.model)) {
        $scope.fieldCtrl.model = [];
      }
      self.groups = $scope.fieldCtrl.model;
      self.assignColors();

      if (!self.groups.length) {
        self.addColumn();
      }
      self.colvolActive = (self.groups.length > 0) ? 0 : -1;
    };

    //todo - prevent adding too many empty groups
    self.addColumn = function () {
      self.groups.push({
        columns: [],
        volume: {
          value: 50,
          unit: 'microliter'
        }
      });
      self.assignColors();
      self.colvolActive = self.groups.length - 1;
    };

    self.deleteGroup = function (group) {
      _.remove(self.groups, group);
    };

    self.handleColumnSelection = function (column) {
      if (self.colvolActive < 0) return;

      //coerce to string
      column = '' + column;

      var colToGroupMap = _.zipObject(_.flatten(_.map(self.groups, function (group, groupIndex) {
        return _.map(group.columns, function (col) {
          return [col, groupIndex]
        });
      }))),
          colInGroup = _.result(colToGroupMap, column, -1);

      //prune if exists
      if (colInGroup >= 0) {
        _.remove(self.groups[colInGroup].columns, function (val) {
          return _.isEqual(column, val);
        });
      }

      //add where appropriate
      if (colInGroup == -1 || ! _.isEqual(self.colvolActive, colInGroup)) {
        self.groups[self.colvolActive].columns.push('' + column);
      }
    };

    self.assignColors = function() {
      _.forEach(self.groups, function (group, index) {
        _.assign(group, {color: self.colors[index]})
      });
    };

    self.parseInt = _.parseInt;
  });
