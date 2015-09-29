'use strict';

/**
 * @ngdoc function
 * @name wetLabAccelerator.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('DataCtrl', function ($scope, $q, $http, Auth, Project, Container, Run, Data, DataConv, ContainerOptions) {

    var self = this;

    $scope.current = {};

    Auth.watch(function () {
      self.projects = Project.list();
    });

    $scope.$watch('current.project', function (newval) {
      if (!newval) return;
      self.runs = Run.list({project: newval});
    });

    $scope.$watch('current.run', function (newval) {
      if (!newval) return;

      //todo

      Data.run({
        project: $scope.current.project,
        run: newval
      }).$promise.then(function (result) {
        var pruned = _.omit(result, function (val, key) {
          return _.isFunction(val) || key.charAt(0) == '$';
        });
        setData(DataConv.parseGrowthCurve(pruned));
      })
    });


    self.selectTimepoint = function (index) {
      $scope.timepointSlider = index;
      $scope.currentTimepoint = $scope.timepointValues[index];
    };

    self.hoverPlateWells = function (wells) {
      self.currentWells = wells;
    };

    self.selectPlateWells = function (wells) {
      self.currentWells = wells;
    };

    function setData (data) {
      self.inputData = data;
      self.containers = _.keys(data);
      self.setCurrentDataContainer(self.containers[0]);
    }

    self.setCurrentDataContainer = function (containerKey) {

      self.currentContainerReference = containerKey;
      self.currentData = self.inputData[self.currentContainerReference];

      //hack - need to get from the data
      self.currentContainer = '384-flat';

      $scope.timepointValues = _.keys(self.currentData);
      $scope.numberTimepoints = $scope.timepointValues.length;

      self.selectTimepoint(0);
    };


    self.downloadDemo = function (filename) {
      $http.get('demo_data/' + filename + '.json')
      .success(function (results) {
        console.log(results);
        setData(DataConv.parseGrowthCurve(results));
      });
    };

  });
