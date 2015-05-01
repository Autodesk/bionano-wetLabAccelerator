'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingResultsCtrl
 * @description
 * # TestingResultsCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingResultsCtrl', function ($scope, $http) {
    var self = this;

    //todo - use run helper and protocol helper
    //todo - when get the run, if not completed, ping transcriptic for data

    $http.get('demo_protocols/omniprotocol/protocol_transfer.json')
    .success(function (d) {
      self.protocol = d;
    });

    $scope.$watch('resultsCtrl.currentInfo', function (newval) {
      if (_.isObject(newval)) {
        self.currentGroup = self.protocol.groups[newval.group];
        self.currentOperation = self.currentGroup.steps[newval.step];
      }
    });

    self.downloadResults = function () {
      alert('todo');
    };

  });
