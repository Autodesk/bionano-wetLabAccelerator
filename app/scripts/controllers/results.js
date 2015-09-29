'use strict';

/**
 * @ngdoc function
 * @name wetLabAccelerator.controller:TestingResultsCtrl
 * @description
 * # TestingResultsCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('ResultsCtrl', function ($scope, $q, $http, RunHelper, TranscripticAuth) {
    var self = this;

    self.run = RunHelper.currentRun;

    /*
    $http.get('demo_runs/transformation_4-30.json')
      .success(RunHelper.assignCurrentRun);
     */

    $scope.$watch(function () {
      return _.result(self.run, 'metadata.transcripticRunId');
    }, function (newId) {
      newId && RunHelper.updateRunInfo(self.run);
    });

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
          self.currentGroup     = _.result(self.run, 'protocol.groups', {})[newval.group];
          self.currentOperation = _.result(self.currentGroup, 'steps', {})[newval.step];
        }
      });

    self.generateRunCsvUrl = function (run) {
      return self.generateRunUrl(run) + '/data.zip';
    };

    self.generateRunUrl = function (run) {
      return 'http://secure.transcriptic.com/' + TranscripticAuth.organization() + '/' + _.result(run, 'metadata.transcripticProjectId') + '/runs/' + _.result(run, 'metadata.transcripticRunId');
    };

    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };

    self.onModalClose = function () {
      RunHelper.saveRun(self.run);
    };

  });
