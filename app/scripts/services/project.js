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
     {
       organization: Auth.organization
     },
     {
       /**
        * @param parameters {Object} ignore
        * @param postData {Object} consisting of:
        * name {String} name of new project
        */
       create: Communication.defaultResourceActions({
         method: "POST"
       })
     });
  });
