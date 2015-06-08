'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:ColumnvolumesctrlCtrl
 * @description
 * # ColumnvolumesctrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('columnVolumesCtrl', function ($scope) {
    var self = this;

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
      self.colvolActive = (self.groups.length > 1) ? 0 : -1;
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
