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

    self.groups = [];

    self.setGroups = function (groups) {
      self.groups.length = 0;
      _.forEach(groups, function (group) {
        self.groups.push(group);
      });
    };

    self.colvolActive = 0;

    self.activateGroup = function (index) {
      self.colvolActive = index;
    };

    self.handleColumnSelection = function (column) {
      //todo - toggle
      //todo - toggle other groups
      self.groups[self.colvolActive].columns.push('' + column);
    };


  });
