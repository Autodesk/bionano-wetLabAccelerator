'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingResultsCtrl
 * @description
 * # TestingResultsCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingResultsCtrl', function ($scope, $http, RunHelper) {
    var self = this;

    self.run = RunHelper.currentRun;

    //todo - when get the run, if not completed, ping transcriptic for data (add function to RunHelper)
    $http.get('demo_runs/transformation_4-30.json')
    .success(RunHelper.assignCurrentRun);

    $scope.$watch('resultsCtrl.currentInfo', function (newval) {
      if (!_.isEmpty(newval)) {
        self.currentGroup = self.run.protocol.groups[newval.group];
        self.currentOperation = self.currentGroup.steps[newval.step];

        //todo
        self.currentData = {};
      }
    });

  });
