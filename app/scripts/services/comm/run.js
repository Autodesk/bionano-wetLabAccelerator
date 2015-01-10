'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.run
 * @description
 * # run
 * Factory in the transcripticApp.
 */
angular.module('transcripticApp')
  .factory('Run', function ($resource, $q, Communication, Auth, Project) {
    var runResource = $resource(Communication.root + ':organization/:project/runs',
      //defaults
      {
        organization: Auth.organization
      },

      //actions
      {
        /**
         * @name submit
         * @description Submit a run
         * @param parameters {Object} with keys:
         * project {String} Project ID
         * @param postData {Object} consisting of:
         * title {String} Name of Run
         * protocol {Protocol} well-formed protocol
         *
         * @example

         Run.submit({project: "p17a7q9dd7zcy"}, {
            "title": "Incubate bacteria",
            "protocol": {
              "refs": {
                "plate1": {
                  "id": "ct17aabqfrmy4y",
                  "store": { "where": "cold_4" }
                }
              },
              "instructions": [
                {
                  "op": "incubate",
                  "object": "plate1",
                  "where": "warm_37",
                  "duration": "2:hour",
                  "shaking": true
                }
              ]
            }
          });

         */
        submit: Communication.defaultResourceActions({
          method: "POST"
        }),

        /**
         * @name submit
         * @description Submit a run
         * @param parameters {Object} with keys:
         * project {String} Project ID
         * @param postData {Object} consisting of:
         * title {String} Name of Run
         * protocol {Protocol} well-formed protocol
         */
        analyze: Communication.defaultResourceActions({
          method: "POST",
          url: Communication.root + ':organization/:project/runs/analyze'
        }),

        /**
         * @name list
         * @description Get a list of runs for a project
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         */
        list: Communication.defaultResourceActions({
          method: "GET",
          url: Communication.root + ':organization/:project',
          isArray: true,
          transformResponse: function (data, headers) {
            return data.runs;
          }
        }),

        //todo
        listCurrent: Communication.defaultResourceActions({
          method: "GET",
          isArray: true
        }),

        /**
         * @name view
         * @description Monitor the status of a run
         * @param parameters {Object} with keys:
         * project {String} Project ID
         * run {String} Run ID
         */
        view: Communication.defaultResourceActions({
          method: "GET",
          url: Communication.root + ":organization/:project/runs/:run"
        })
      });

    //todo - maybe it makes sense to just make this a resource for consistency
    return angular.extend(runResource, {
        listAll: function () {
          return Project.list().$promise.then(function (projects) {
            return $q.all(projects.map(function (proj) {
              return runResource.list({project: proj.url}).$promise;
            })).
            then(function (allRuns) {
              return _.flatten(allRuns);
            });
          });
        }
      });
  });
