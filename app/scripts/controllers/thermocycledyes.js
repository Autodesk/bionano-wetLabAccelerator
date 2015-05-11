'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:ThermocycledyesCtrl
 * @description
 * # ThermocycledyesCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('ThermocycleDyesCtrl', function ($scope, DyeOptions) {

    var self = this;

    //todo - container needs to be dynamic!

    this.dyeOptions = DyeOptions;

    this.colors = {
      "channel1" : "purple",
      "channel2" : "blue",
      "channel3" : "green",
      "channel4" : "yellow",
      "channel5" : "red"
    };

    this.activateChannelIndex = function (idx) {
      self.activeChannelIndex = idx;
      self.dyeWells = _.result($scope.fieldCtrl.model[idx], 'wells', []);
    };

    this.handleWellSelection = function (wells) {
      $scope.fieldCtrl.model[self.activeChannelIndex].wells = _.xor($scope.fieldCtrl.model[self.activeChannelIndex].wells, wells);
    };

    //init

    this.init = function () {
      $scope.fieldCtrl.model = _.isUndefined($scope.fieldCtrl.model) ? [] : $scope.fieldCtrl.model;
      self.activateChannelIndex(0);
    };

  });
