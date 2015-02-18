'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('DataCtrl', function ($scope, $q, $http, Auth, Project, Container, Run, Data) {

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

      downloadParseRundata($scope.current.project, newval);
    });

    function downloadParseRundata (project, run) {
      if (!project || !run) return;

      $q.all([
        Data.run({
          project: project,
          run: run
        }).$promise
      ])
      .then(function (results) {
        console.log(results);
        self.rundata = results[0];

        var wrangled = wrangleData(self.rundata);

        self.runcontainers = wrangled.runcontainers;
        self.parsedData = wrangled.parsedData;
        self.currentContainer = _.sample(self.runcontainers);
      });
    }

    function wrangleData (rundata) {
      var datarefs = _.pick(rundata, function (d) { return d.id; }),
          timepoints = _.keys(datarefs),
          //note - assumes wells in one are same as in all... which is often not accurate
          wells = _.keys(datarefs[timepoints[0]].data),
          //set up object in form {<well> : [], ... }
          parsedData = _.mapValues(_.zipObject(wells), function () { return []; }),
          runcontainers = {};

      _.forEach(datarefs, function (dataref, key) {
        //map for containers
        var obj = dataref.instruction.operation.object;

        if (_.isUndefined(runcontainers[obj])) {
          runcontainers[obj] = dataref.container_type;
        }

        // reformat data so indexed by well
        // {<well> : [{dataref : <dataref>, value: <value>}, ...], ... }
        _.forEach(wells, function (well) {
          parsedData[well].push({
            x: key,                   //dataref
            y: dataref.data[well][0]  //value
          });
        });
      });

      return {
        runcontainers: runcontainers,
        parsedData: parsedData
      }
    }

    self.downloadDemo = function (filename) {
      $q.all([
        $http.get('demo_data/' + filename + '.json')
      ])
      .then(function (results) {
        console.log(results);
        self.rundata = results[0].data;

        var wrangled = wrangleData(self.rundata);

        self.runcontainers = wrangled.runcontainers;
        self.parsedData = wrangled.parsedData;
        self.currentContainer = _.sample(self.runcontainers);
      });
    };
  });
