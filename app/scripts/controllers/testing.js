'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:RefsCtrl
 * @description
 * # RefsCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingCtrl', function ($scope, WellConv, ContainerOptions) {

    $scope.containerKeys = _.keys(ContainerOptions);
    $scope.currentContainer = $scope.containerKeys[0];

    //timepoints

    $scope.numberTimepoints = 10;
    $scope.timepointValues = _.map( _.range(0, $scope.numberTimepoints), function (ind) {
      return 'tp_' + ind;
    });

    $scope.selectTimepoint = function (index) {
      $scope.currentTimepoint = $scope.timepointValues[index];
    };

    //changes / selections

    $scope.onContainerChange = function () {
      var container = ContainerOptions[$scope.currentContainer],
          wellCount = container.well_count,
          colCount = container.col_count,
          rowCount = wellCount / colCount,
          wellArray = WellConv.createArrayGivenBounds([0,1], [rowCount - 1, colCount]);

      $scope.currentData = _.zipObject(
        $scope.timepointValues,
        _.map(
          _.range(0, $scope.numberTimepoints),
          function (index) {
            return createTimepointRandom(wellArray , _.at($scope.timepointValues, index) );
          }
        )
      );
    };

    $scope.hoverPlateWells = function (wells) {
      $scope.currentWells = wells;
    };

    $scope.selectPlateWells = function (wells) {
      //console.log(wells);
    };

    //init

    $scope.selectTimepoint(0);
    $scope.onContainerChange();

    //helpers

    function createTimepointRandom (wellArray, mapVal) {
      return _.zipObject(
        wellArray,
        _.map( wellArray, function (well) {
          return {
            key  : well,
            value: Math.random(),
            ordinal : mapVal
          }
        })
      );
    }
  });
