/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc function
 * @name wetLabAccelerator.controller:ThermocycledyesCtrl
 * @description
 * # ThermocycledyesCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('ThermocycleDyesCtrl', function ($scope, DyeOptions) {

    var self = this;

    //be sure to use ng-if on containing element for field values, since should only assume model is accurate when not using parameters

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
