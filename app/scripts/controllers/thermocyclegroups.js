'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:ThermocyclegroupsctrlCtrl
 * @description
 * # ThermocyclegroupsctrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('thermocycleGroupsCtrl', function ($scope) {
    var self = this;

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
