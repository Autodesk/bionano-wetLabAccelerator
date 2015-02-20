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
      var container = ContainerOptions[$scope.currentContainer];

      var dataObj = {
        containerOne : DataConv.generateRandomGrowthCurve(container, 4, Date.now().valueOf())
      };

      setData(dataObj);
    };

    $scope.hoverPlateWells = function (wells) {
      $scope.currentWells = wells;
    };

    $scope.selectPlateWells = function (wells) {
      $scope.currentWells = wells;
    };

    function setData (data) {
      $scope.loadedDemo = false;
      $scope.inputData = data;
      $scope.containers = _.keys(data);
      $scope.setCurrentDataContainer($scope.containers[0]);
    }

    $scope.setCurrentDataContainer = function (containerKey) {

      //todo - get container

      $scope.currentContainerReference = containerKey;
      $scope.currentData = $scope.inputData[$scope.currentContainerReference];

      $scope.timepointValues = _.keys($scope.currentData);
      $scope.numberTimepoints = $scope.timepointValues.length;

      $scope.selectTimepoint(0);
    };

    //testing

    $scope.openGrowthCurve = function () {
      $http.get('demo_data/growth-0216.json').success(function (d) {
        setData(DataConv.parseGrowthCurve(d, true));
        $scope.loadedDemo = true;
      });
    };

    //init

    $scope.onContainerChange();
  });
