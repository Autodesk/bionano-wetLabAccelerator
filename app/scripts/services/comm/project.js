'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Project
 * @description
 * # Project
 * Factory in the transcripticApp.
 */
angular.module('tx.communication')
  .factory('Project', function ($resource, Communication, TranscripticAuth) {
    return $resource(Communication.root + ':organization',
      //defaults
      {
        organization: TranscripticAuth.organization
      },

      //defaults
      {
        /**
         * @name create
         * @description Create a new project
         * @param parameters {null} empty object
         * @param postData {Object} consisting of:
         * name {String} name of new project
         */
        create: Communication.defaultResourceActions({
          method: "POST"
        }),

        /**
         * @name view
         * @description Get data about a project
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         */
        view: Communication.defaultResourceActions({
          method: "GET",
          url   : Communication.root + ':organization/:project'
        }),

        /**
         * @name list
         * @description Get list of projects
         */
        list: Communication.defaultResourceActions({
          method           : "GET",
          url              : Communication.root + ':organization/projects',
          isArray          : true,
          /*
          //debug
          transformRequest : function (data, headers) {
            console.log(data);
            console.log(headers());
          },
          */
          transformResponse: function (data, headers) {
            //todo - check for more than 1 page / pass param for more than 10
            return angular.isArray(data.results) ? data.results : data;
          }
        }),

        /**
         * @name remove
         * @description Delete a project
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         */
        remove: Communication.defaultResourceActions({
          method: "DELETE",
          url   : Communication.root + ':organization/:project'
        })
      });
  });
