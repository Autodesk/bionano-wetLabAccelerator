'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('AuthCtrl', function ($scope, Auth) {
    $scope.Auth = Auth;
  });
