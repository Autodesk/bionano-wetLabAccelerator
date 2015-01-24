'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('DataCtrl', function ($scope, $q, Auth, Project, Container, Run, Data) {

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

      $q.all([
        Run.view({
          project: $scope.current.project,
          run: newval
        }).$promise,
        Data.run({
          project: $scope.current.project,
          run: $scope.current.run
        }).$promise
      ])
      .then(function (results) {
          console.log(results);
        self.runinfo = results[0];
        self.rundata = results[1];

        //wrangle out the data we want
        //todo - optimize...

        var datarefs = _.pick(self.rundata, function (d) { return d.id; }),
            timepoints = _.keys(datarefs),
            //note - assumes wells in one are same as in all
            wells = _.keys(datarefs[timepoints[0]].data),
            //set up object in form {<well> : [], ... }
            parsedData = _.mapValues(_.zipObject(wells), function () { return []; });

        self.runcontainers = {};

        _.forEach(datarefs, function (dataref, key) {
          //map for containers
          var obj = dataref.instruction.operation.object;

          if (_.isUndefined(self.runcontainers[obj])) {
            var cont = _.find(self.runinfo.refs, function (ref) {
              return ref.name == obj;
            });
            self.runcontainers[obj] = cont.container_type;
          }

          // reformat data so indexed by well
          // {<well> : [{dataref : <dataref>, value: <value>}, ...], ... }
          _.forEach(wells, function (well) {
            parsedData[well].push({
              dataref: key,
              value: dataref.data[well][0]
            });
          });
        });

        self.parsedData = parsedData;
        self.currentContainer = _.sample(self.runcontainers);
      });
    });

    self.wellHover = function (well) {

    };

    self.wellSelect = function (wells) {

    };

  });
