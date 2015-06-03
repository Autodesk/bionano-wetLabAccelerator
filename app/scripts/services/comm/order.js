'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Order
 * @description
 * # Order
 * Factory in the transcripticApp.
 */
angular.module('tx.communication')
  .factory('Order', function ($resource, Communication, TranscripticAuth) {
    return $resource(Communication.root + ':organization/:project/runs',
      //defaults
      {
        organization: TranscripticAuth.organization
      },

      //methods
      {
        /**
         * @name create
         * @description Create a new project
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         * @param postData {Object} consisting of:
         * title {String} name of new project
         * request {Object} the actual request
         */
        price: Communication.defaultResourceActions({
          method: "POST"
        })
      });
  });
