'use strict';

/**
 * @ngdoc function
 * @name wetLabAccelerator.controller:GelSeparateCtrl
 * @description
 * # GelSeparateCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('GelSeparateCtrl', function ($scope, GelOptions) {
    this.ladders = GelOptions.ladder;
    this.matrices = GelOptions.matrix;
  });
