'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.communication
 * @description
 * # communication
 * Service in the transcripticApp.
 */
angular.module('tx.communication')
  .service('Communication', function (TranscripticAuth, $q, $http) {

    var self = this;

    this.localRoot        = '/transcriptic/';
    this.transcripticRoot = "https://secure.transcriptic.com/";
    this.platformRoot     = "https://platform.bionano.autodesk.com/transcriptic/";

    //default
    //this.root = this.transcripticRoot;

    //proxy
    this.root = this.platformRoot;


    //pass in overrides as Object
    //use a function to recreate TranscripticAuth each time
    this.defaultResourceActions = function (params, orgUnrequired) {
      var headers = _.assign({}, TranscripticAuth.headers(), _.result(params, headers));

      if (_.isObject(params)) {
        delete params.headers;
      }

      var timeoutPromise = $q.defer(),
          timeoutCancel  = 10000;

      /*
      //fixme - these are only set once, and so never valid - should be setting timeout on each request
      //prevent requests when organization is not set
      if (_.isEmpty(TranscripticAuth.organization()) && !orgUnrequired) {
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

    //returns promise which will resolve with organizations if valid, fail if not
    this.validate = function validateCreds () {

      if (!_.every(['organization', 'email', 'key'], _.partial(_.result, TranscripticAuth, _))) {
        return $q.reject(false);
      }

      return self.request('organizations');
    };

    this.request = function (url, method, params) {
      return $http[method || 'get'](self.root + url, self.defaultResourceActions(params));
    };

    this.requestUrl = function (url) {
      return self.root + url;
    };

  });
