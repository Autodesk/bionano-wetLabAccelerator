'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('DataCtrl', function ($scope, $q, Project, Run, Data) {

    var self = this;

    $scope.current = {};

    this.projects = Project.list();

    $scope.$watch('current.project', function (newval) {
      if (!newval) return;
      self.runs = Run.list({project: newval});
    });

    /*
    Run.listAll().then(function (r) {
      self.runs = r;
    });

    //this is slow... speed it up
    $scope.filterToProject = function (runs) {
      if (_.isUndefined($scope.current.url)) {
        return [];
      }

      console.log(self.projects, $scope.current.url);
      var cur = _.find(self.projects, {url : $scope.current.url});
      console.log(cur.runs);
      return _.filter(runs, function (run) {
        console.log(run);
        return _.indexOf(cur.runs, run);
      })
    };
    */

    this.view = function (project, run) {
      this.data = Data.view({
        project: project,
        run: run
      }).$promise.then(function (data) {
        console.log(data);
        return data.data;
      });
    };

  });
