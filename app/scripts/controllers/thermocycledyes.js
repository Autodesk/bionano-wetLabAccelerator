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
      "channel1" : "#dd22dd",
      "channel2" : "#2222dd",
      "channel3" : "#22dd22",
      "channel4" : "#dddd22",
      "channel5" : "#dd2222"
    };

    this.activateChannelIndex = function (idx) {
      self.activeChannelIndex = idx;
      self.dyeWells = _.result($scope.fieldCtrl.model[idx], 'wells', []);
    };

    this.handleWellSelection = function (wells) {
      var modelForDye = $scope.fieldCtrl.model[self.activeChannelIndex];

      modelForDye.wells = _.xor(modelForDye.wells, wells);

      //if didn't have a dye selected, make sure one is chosen
      //don't do in ng-init because dont want to override
      //so hack to get the dye
      if (_.isUndefined(modelForDye.dye)) {
        modelForDye.dye = _.first(self.dyeOptions['channel' + (self.activeChannelIndex + 1)]);
      }

      //update our input just in case
      self.dyeWells = modelForDye.wells;
    };

    //init

    this.init = function () {
      $scope.fieldCtrl.model = _.isUndefined($scope.fieldCtrl.model) ? [] : $scope.fieldCtrl.model;
      self.activateChannelIndex(0);
    };

  });
