'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:RefsCtrl
 * @description
 * # RefsCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('RefsCtrl', function ($scope, $http, ProtocolFactory) {

    $scope.myDimension = "25:microliter";

    $http.get('demo_protocols/ref-stanza-example.json').success(function(data) {
      var protocol = new ProtocolFactory({
        refs: data
      });

      $scope.myRefs = protocol.refs;
    });

    this.wellParams = {
      volume: '100:microliter',
      speed: '100:microliter/second'
    };

    $http.get('demo_protocols/aaron-growth.json').success(function(data) {
      $scope.protocol = new ProtocolFactory(data);
    });

  });
