'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:PipetteCtrl
 * @description
 * # PipetteCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('PipetteCtrl', function ($scope) {
    //note assumes there is only one key for each group - the liquid handling step
    this.groupKey = function (group) {
      return Object.keys(group)[0];
    };

    this.groupUrl = function (group) {
      return 'views/instructions/pipette/' + this.groupKey(group) + '.html';
    };
  });
