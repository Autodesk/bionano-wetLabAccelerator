'use strict';

/**
 * @ngdoc function
 * @name wetLabAccelerator.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('HomeCtrl', function ($scope, $location) {
    this.hideOverlay = function () {
      $location.path('/protocol');
    };
  });
