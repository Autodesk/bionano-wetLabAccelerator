'use strict';

/**
 * @ngdoc function
 * @name wetLabAccelerator.controller:OrderCtrl
 * @description
 * # OrderCtrl
 * Controller of the wetLabAccelerator, for a specific orer
 */
angular.module('wetLabAccelerator')
  .controller('OrderCtrl', function ($scope, OligoOptions) {
    $scope.purityOptions = OligoOptions.purity;
    $scope.scaleOptions = OligoOptions.scale;
  });
