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
    this.groupKey = function (group) {
      return group.keys()[0];
    };

    this.groupUrl = function (group) {
      return 'views/instructions/pipette/' + this.groupKey(group) + '.html';
    }.bind(this);
  });
