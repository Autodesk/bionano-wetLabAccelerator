'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Container
 * @description
 * # Container
 * Factory in the transcripticApp.
 */
angular.module('transcripticApp')
  .factory('Container', function ($resource, ContainerOptions, Communication, Auth) {

    return $resource(Communication.root + ':organization/containers/:id',
      //defaults
      {
        organization: Auth.organization
      },

      //actions
      {
        /**
         * @name list
         * @description Get a list of all runs
         */
        list: Communication.defaultResourceActions({
          method: "GET",
          url: Communication.root + ':organization/containers',
          isArray: true,
          transformResponse: function (data, headers) {
            //todo - check for more than 1 page
            return data.results;
          }
        }),

        /**
         * @name view
         * @description Get details about a container
         * @param parameters {Object} consisting of:
         * id {String} Container
         */
        view: Communication.defaultResourceActions({
          method: "GET"
        })
      });
  });
