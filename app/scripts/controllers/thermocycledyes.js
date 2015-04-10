'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:ThermocycledyesCtrl
 * @description
 * # ThermocycledyesCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('ThermocycleDyesCtrl', function (DyeOptions) {
    this.dyeOptions = DyeOptions;
  });
