'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.run
 * @description
 * # run
 * Factory in the transcripticApp.
 */
angular.module('transcripticApp')
  .factory('Run', function ($resource, Communication, Auth) {
    return $resource(Communication.root + ':organization/:project/runs',
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
         * @param postData {Protocol} A well-formed Protocol JSON
         */
        submit : Communication.defaultResourceActions({
          method: "POST"
        }),

        /**
         * @name list
         * @description Get a list of all runs
         */
        list: Communication.defaultResourceActions({
          method: "GET",
          isArray: true
        }),

        /**
         * @name monitor
         * @description Monitor the status of a run
         * @param parameters {Object} with keys:
         * project {String} Project ID
         * run {String} Run ID
         */
        monitor: Communication.defaultResourceActions({
          method: "GET",
          url: Communication.root + ":organization/:project/runs/:run"
        })
      });
  });
