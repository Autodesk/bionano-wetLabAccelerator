'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.communication
 * @description
 * # communication
 * Service in the transcripticApp.
 */
angular.module('tx.communication')
  .service('Communication', function (Auth, $q, $http) {

    var self = this;

    this.localRoot        = '/transcriptic/';
    this.transcripticRoot = "https://secure.transcriptic.com/";
    this.platformRoot     = "https://platform.bionano.autodesk.com/transcriptic/";

    //default
    //this.root = this.transcripticRoot;

    //proxy
    this.root = this.platformRoot;


    //pass in overrides as Object
    //use a function to recreate Auth each time
    this.defaultResourceActions = function (params, orgUnrequired) {
      var headers = _.assign({}, Auth.headers(), params.headers);
      delete params.headers;

      var timeoutPromise = $q.defer(),
          timeoutCancel = 7000;

      /*
      //fixme - these are only set once, and so never valid - should be setting timeout on each request
      //prevent requests when organization is not set
      if (_.isEmpty(Auth.organization()) && !orgUnrequired) {
        console.debug('empty org');
        timeoutCancel = timeoutPromise.promise;
        timeoutPromise.resolve();
      } else {
        console.debug('submitting request');
      }
      */

      return angular.extend({
        headers        : headers,
        withCredentials: true,
        cache          : false,
        timeout        : timeoutCancel,
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
