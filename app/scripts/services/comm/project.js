'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Project
 * @description
 * # Project
 * Factory in the transcripticApp.
 */
angular.module('transcripticApp')
  .factory('Project', function ($resource, Communication, Auth) {
   return $resource(Communication.root + ':organization',
     //defaults
     {
       organization: Auth.organization
     },

     //defaults
     {
       /**
        * @name create
        * @description Create a new project
        * @param parameters {null} ignore
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
         url: Communication.root + ':organization/:project'
       }),

       /**
        * @name list
        * @description Get list of projects
        */
       list: Communication.defaultResourceActions({
         method: "GET",
         url: Communication.root + ':organization/projects',
         isArray: true,
         transformResponse: function (data, headers) {
           return data.results;
         }
       })
     });
  });
