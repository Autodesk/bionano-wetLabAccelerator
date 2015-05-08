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
          steps: []
        }
      });
    };

    self.addStep = function (group) {
      group.steps.push({});
    };


    self.onInit = function () {
      //note - hack - expects a fieldCtrl
      if (_.isEmpty($scope.fieldCtrl.model) && ! _.isArray($scope.fieldCtrl.model)) {
        $scope.fieldCtrl.model = [];
      }
      self.groups = $scope.fieldCtrl.model;
    };
  });
