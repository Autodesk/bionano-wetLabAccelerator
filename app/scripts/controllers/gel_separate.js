'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:GelSeparateCtrl
 * @description
 * # GelSeparateCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('GelSeparateCtrl', function ($scope, GelOptions) {
    this.ladders = GelOptions.ladder;
    this.matrices = GelOptions.matrix;
  });
