'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:ResultsspectrophotometryctrlCtrl
 * @description
 * # ResultsspectrophotometryctrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('ResultsSpectrophotometryCtrl', function ($scope, Omniprotocol, DataConv, ContainerOptions) {

    var self = this;

    //hack - relying on summaryCtrl like this
    $scope.$watch('summaryCtrl.indices', function (newIndices) {
      self.opName = $scope.summaryCtrl.operation.operation;

      self.rundataFiltered = _.pick($scope.summaryCtrl.runData, function (dataref) {
        return _.result(dataref, 'instruction.operation.op') == self.opName;
      });

      self.opData = DataConv.parseGrowthCurve(self.rundataFiltered, true);

      self.containers = _.keys(self.opData);
      self.selectContainer(self.containers[0]);

      //todo - perf... maybe look at the autoprotocol or something?
      var unfolded  = Omniprotocol.utils.unfoldProtocol($scope.summaryCtrl.protocol),
          timepoint = _.reduce(unfolded, function (opIndexOfType, operation, flatIndex) {
            if (operation.operation == self.opName && flatIndex < newIndices.unfolded) {
              opIndexOfType++;
            }
            return opIndexOfType;
          }, 0);

      self.selectTimepoint(timepoint);
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

    self.onGraphHover = function (well) {
      self.focusedWells = _.isUndefined(well) ? [] : [well];
    };
  });
