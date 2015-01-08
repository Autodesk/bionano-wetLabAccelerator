'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Data
 * @description
 * # Data
 * Factory in the transcripticApp.
 */
angular.module('transcripticApp')
  .factory('Data', function ($resource, ContainerOptions, Communication, Auth) {

    return $resource(Communication.root + ':organization/:project/runs/:run/data',
      //defaults
      {
        organization: Auth.organization
      },

      //actions
      {
        /**
         * @name view
         * @description Get details about a container
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         * run {String} Run ID
         */
        view: Communication.defaultResourceActions({
          method: "GET"
        })
      });
  });
