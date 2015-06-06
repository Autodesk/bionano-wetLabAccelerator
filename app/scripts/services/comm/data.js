'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Data
 * @description
 * # Data
 * Factory in the transcripticApp.
 */
angular.module('tx.communication')
  .factory('Data', function ($resource, ContainerOptions, Communication, TranscripticAuth) {

    return $resource(Communication.root + ':organization/:project/runs/:run/data',
      //defaults
      {
        organization: TranscripticAuth.organization
      },

      //actions
      {
        /**
         * @name run
         * @description Get details about a run
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         * run {String} Run ID
         */
        run: Communication.defaultResourceActions({
          method: "GET"
        }),

        /**
         * @name dataref
         * @description Get details about a dataref (i.e. one part of a run)
         * @param parameters {Object} consisting of:
         * dataref {String} dataref ID
         */
        dataref: Communication.defaultResourceActions({
          url: Communication.root + "data/:dataref",
          method: "GET"
        })
      });
  });
