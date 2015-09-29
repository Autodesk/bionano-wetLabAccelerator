'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('HomeCtrl', function ($scope, $location) {
    this.hideOverlay = function () {
      $location.path('/protocol');
    };
  });
