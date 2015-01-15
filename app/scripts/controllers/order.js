'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:OrderCtrl
 * @description
 * # OrderCtrl
 * Controller of the transcripticApp, for a specific orer
 */
angular.module('transcripticApp')
  .controller('OrderCtrl', function ($scope, OligoOptions) {
    $scope.purityOptions = OligoOptions.purity;
    $scope.scaleOptions = OligoOptions.scale;
  });
