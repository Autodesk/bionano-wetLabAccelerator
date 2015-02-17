'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:RefsCtrl
 * @description
 * # RefsCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingPlateCtrl', function ($scope, $http, WellConv, DataConv, ContainerOptions) {

    $scope.containerKeys = _.keys(ContainerOptions);
    $scope.currentContainer = $scope.containerKeys[0];

    $scope.selectTimepoint = function (index) {
      $scope.timepointSlider = index;
      $scope.currentTimepoint = $scope.timepointValues[index];
    };

    //changes / selections

    $scope.onContainerChange = function () {
      var container = ContainerOptions[$scope.currentContainer],
          wellCount = container.well_count,
          colCount = container.col_count,
          rowCount = wellCount / colCount,
          wellArray = WellConv.createArrayGivenBounds([0,1], [rowCount - 1, colCount]);

      //for testing
      var numberTimepoints = 10,
          timepointValues  = _.map( _.range(0, numberTimepoints), function (ind) {
        return 'tp_' + ind;
      });

      var dataObj = _.zipObject(
        timepointValues,
        _.map(
          _.range(0, numberTimepoints),
          function (index) {
            return createTimepointRandom(wellArray , timepointValues[index] );
          }
        )
      );

      setData(dataObj);
    };

    $scope.hoverPlateWells = function (wells) {
      $scope.currentWells = wells;
    };

    $scope.selectPlateWells = function (wells) {
      //console.log(wells);
    };

    //init

    $scope.onContainerChange();
    $scope.selectTimepoint(0);

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

    function setData (data) {
      delete $scope.currentData;

      $scope.currentData = data;

      $scope.timepointValues = _.keys($scope.currentData);
      $scope.numberTimepoints = $scope.timepointValues.length;

      $scope.selectTimepoint(0);
    }

    //testing

    $scope.openGrowthCurve = function () {
      $http.get('demo_data/growth-0216.json').success(function (d) {
        var parsed = DataConv.parseGrowthCurve(d);
        setData(parsed);
      });
    };
  });
