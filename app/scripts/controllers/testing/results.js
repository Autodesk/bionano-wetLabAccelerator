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

    $http.get('demo_protocols/omniprotocol/protocol_transfer.json')
    .success(function (d) {
      self.protocol = d;
    });
  });
