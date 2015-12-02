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
 * @name wetLabAccelerator.controller:ResultsspectrophotometryctrlCtrl
 * @description
 * # ResultsspectrophotometryctrlCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('ResultsSpectrophotometryCtrl', function ($scope, Omniprotocol, DataConv, ContainerOptions) {

    var self = this;

    self.graphLabels = {
      "absorbance"  : {
        xlabel: "Timepoint",
        ylabel: "Absorbance Units (AU)",
        title : "Absorbance Readings"
      },
      "fluorescence": {
        xlabel: "Timepoint",
        ylabel: "Relative Light Units (RLU)",
        title : "Fluorescence Readings"
      },
      "luminescence": {
        xlabel: "Timepoint",
        ylabel: "Relative Light Units (RLU)",
        title : "Luminescence Readings"
      }
    };

    //hack - relying on summaryCtrl like this
    $scope.$watch('summaryCtrl.indices', function (newIndices) {
      self.opName = $scope.summaryCtrl.operation.operation;

      self.rundataFiltered = _.pick($scope.summaryCtrl.runData, function (dataref) {
        return _.result(dataref, 'instruction.operation.op') == self.opName;
      });

      self.opData = DataConv.parseGrowthCurve(self.rundataFiltered, true);

      self.containers = _.keys(self.opData);
      self.selectContainer(self.containers[0]);

      var unfoldedIndex = _.result(newIndices, 'unfolded');
      if (_.isNumber(unfoldedIndex)) {
        //todo - perf... maybe look at the autoprotocol or something?
        var unfolded  = Omniprotocol.utils.unfoldProtocol($scope.summaryCtrl.protocol),
            timepoint = _.reduce(unfolded, function (opIndexOfType, operation, flatIndex) {
              if (operation.operation == self.opName && flatIndex < unfoldedIndex) {
                opIndexOfType++;
              }
              return opIndexOfType;
            }, 0);

        self.selectTimepoint(timepoint);
      }
    });

    /*
    var unfolded     = Omniprotocol.utils.unfoldProtocol($scope.summaryCtrl.protocol),
        timepoint = _.reduce(unfolded, function (opIndexOfType, operation) {

          return opIndexOfType + ((operation.operation == self.opName) ? 1 : 0);
        }, 0);
    console.log(timepoint);
    */

    self.selectContainer = function (containerKey) {
      self.currentContainerRef = containerKey;
      self.graphData           = self.opData[containerKey];

      // todo - dynamic based on the actual data, accounting for not all being same container
      self.currentContainer = _.result(_.sample(self.rundataFiltered), 'container_type.shortname');

      self.timepointValues = _.sortBy(_.keys(self.graphData));
    };

    self.selectTimepoint = function (idx) {
      self.timepointSlider  = idx;
      self.currentTimepoint = self.timepointValues[idx];
    };

    self.hoverPlateWells = function (wells) {
      self.currentWells = wells;
    };

    self.selectPlateWells = function (wells) {
      self.currentWells = wells;
    };

    self.onGraphHover = function (well, ordinal) {
      self.focusedWells = _.isUndefined(well) ? [] : [well];
      var newIndex      = _.indexOf(self.timepointValues, ordinal);
      newIndex >= 0 && self.selectTimepoint(newIndex);
    };
  });
