'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingResultsCtrl
 * @description
 * # TestingResultsCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('ResultsCtrl', function ($scope, $q, $http, RunHelper) {
    var self = this;

    self.run = RunHelper.currentRun;

    //todo - when get the run, if not completed, ping transcriptic for data (add function to RunHelper)
    $http.get('demo_runs/transformation_4-30.json')
    .success(RunHelper.assignCurrentRun);

    /*
    //for testing
    $q.all([
      $http.get('demo_runs/run_dummy2.json'),
      $http.get('demo_protocols/omniprotocol/protocol_transfer.json')
    ])
    .then(function (gets) {
      var run = gets[0].data,
          protocol = gets[1].data;

      _.assign(run.protocol, protocol);
      RunHelper.assignCurrentRun(run)
    });
*/
    $scope.$watch('resultsCtrl.currentInfo', function (newval) {
      if (!_.isEmpty(newval)) {
        self.currentGroup = self.run.protocol.groups[newval.group];
        self.currentOperation = self.currentGroup.steps[newval.step];
      }
    });

  });