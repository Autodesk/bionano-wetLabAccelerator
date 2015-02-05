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

    $scope.onContainerChange = function () {
      var container = ContainerOptions[$scope.currentContainer],
          wellCount = container.well_count,
          colCount = container.col_count,
          rowCount = wellCount / colCount,
          wellArray = WellConv.createArrayGivenBounds([0,1], [rowCount, colCount]);

      $scope.currentData = _.zipObject(wellArray, _.map( wellArray, Math.random ));
    };

    //init
    $scope.onContainerChange();
  });
