'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.communication
 * @description
 * # communication
 * Service in the transcripticApp.
 */
angular.module('tx.communication')
  .service('Communication', function (Auth, $http) {

    var self = this;

    this.localRoot        = '/transcriptic/';
    this.transcripticRoot = "https://secure.transcriptic.com/";
    this.platformRoot     = "https://platform.bionano.autodesk.com/transcriptic/";

    //default
    //this.root = this.transcripticRoot;

    //proxy
    this.root = this.localRoot;


    //pass in overrides as Object
    //use a function to recreate Auth each time
    this.defaultResourceActions = function (params) {
      var headers = _.assign({}, Auth.headers(), params.headers);
      delete params.headers;

      return angular.extend({
        headers        : headers,
        withCredentials: true,
        cache          : false,
        timeout        : 7000,
        responseType   : "json"
      }, params)
    };

    this.request = function (url, method, params) {
      return $http[method || 'get'](self.root + url, self.defaultResourceActions(params));
    };

    this.requestUrl = function (url) {
      return self.root + url;
    };

  });
