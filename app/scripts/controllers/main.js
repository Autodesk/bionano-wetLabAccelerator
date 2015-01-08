'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('MainCtrl', function ($scope, $http, ProtocolFactory) {
    $http.get('demo_protocols/aaron-growth.json').success(function(data) {
      $scope.exampleProtocol = new ProtocolFactory(data);
    });
  });
