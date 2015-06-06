'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Container
 * @description
 * # Container
 * Factory in the transcripticApp.
 */
angular.module('tx.communication')
  .factory('Container', function ($resource, Communication, TranscripticAuth) {

    return $resource(Communication.root + ':organization/containers',
      //defaults
      {
        organization: TranscripticAuth.organization
      },

      //actions
      {
        /**
         * @name list
         * @description Get a list of all containers
         */
        list: Communication.defaultResourceActions({
          method: "GET",
          isArray: true,
          transformResponse: function (data, headers) {
            //todo - check for more than 1 page / pass param for more than 10
            return angular.isArray(data.results) ? data.results : data;
          }
        }),

        /**
         * @name view
         * @description Get details about a container
         * @param parameters {Object} consisting of:
         * id {String} Container
         */
        view: Communication.defaultResourceActions({
          method: "GET",
          url: Communication.root + ':organization/containers/:id'
        }),

        /**
         * @name view
         * @description Get details about a container
         * @param parameters {null}
         * @param payload {Object} consisting of:
         * container_type {String} Container shortname
         * test_mode {Boolean} Whether container is in test_mode
         */
        create: Communication.defaultResourceActions({
          method: "POST"
        })
      });
  });
