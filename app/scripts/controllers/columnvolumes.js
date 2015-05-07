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
      'red',
      'blue',
      'green',
      'yellow',
      'magenta',
      'cyan',
      'white'
    ];

    self.colvolActive = 0;

    self.activateGroup = function (index) {
      self.colvolActive = index;
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
    };

    self.handleColumnSelection = function (column) {
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
    }
  });
