'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.communication
 * @description
 * # communication
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('Communication', function (Auth) {

    //default
    //this.root = "https://secure.transcriptic.com/";

    //proxy
    this.root = "/transcriptic/";


    //pass in overrides as Object
    //use a function to recreate Auth each time
    this.defaultResourceActions = function (params) {
      return angular.extend({
        headers: Auth.headers(),
        withCredentials: true,
        cache: false,
        timeout: 5000,
        responseType: "json"
      }, params)
    };

  });
