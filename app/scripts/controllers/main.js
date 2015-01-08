'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('demo_protocols/growth-curve.json').success(function(data) {
      $scope.exampleProtocol = data;
    })
  });
