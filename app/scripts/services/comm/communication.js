/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.communication
 * @description
 * # communication
 * Service in the wetLabAccelerator.
 */
angular.module('tx.communication')
  .service('Communication', function (TranscripticAuth, $q, $http) {

    var self = this;

    this.localRoot        = '/transcriptic/';
    this.transcripticRoot = "https://secure.transcriptic.com/";
    this.platformRoot     = "https://platform.bionano.autodesk.com/transcriptic/";

    //default
    this.root = this.transcripticRoot;

    //proxy
    //this.root = this.platformRoot;


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
        //withCredentials: true, //send cookies with response
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

    //request, using our proxy
    this.request = function (url, method, params) {
      return $http[method || 'get'](self.root + url, self.defaultResourceActions(params));
    };

    //request directly, avoiding our proxy
    this.requestDirect = function (url, method, params) {
      return $http[method || 'get'](self.transcripticRoot + url, self.defaultResourceActions(params));
    };

    //request directly, avoiding our proxy
    this.requestLocalProxy = function (url, method, params) {
      return $http[method || 'get'](self.localRoot + url, self.defaultResourceActions(params));
    };

    this.requestUrl = function (url) {
      return self.root + url;
    };

  });
