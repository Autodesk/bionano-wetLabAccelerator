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
 * @name wetLabAccelerator.Data
 * @description
 * # Data
 * Factory in the wetLabAccelerator.
 */
angular.module('tx.communication')
  .service('Catalog', function ($http, Communication, TranscripticAuth) {

   var self = this;

    var defaultUrl = Communication.root + '_commercial/resources';

    self.query = function (query) {
      return $http.get(defaultUrl, Communication.defaultResourceActions({
        params: {
          q : query
        },
        cache: true
      }, true));
    };

    /**
     * @name query
     * @description Query the transcriptic catalog
     * @param query {string} Query string, will search over multiple keys decided by transcriptic
     */
    self.byQuery = function (query) {
      return $http.get(defaultUrl, Communication.defaultResourceActions({
        params: {
          q : ((_.isString(query) && query.length) ? query : null)
        },
        cache: true,
        transformResponse: function (data, headers, status) {
          return (angular.isArray(data.results)) ? data.results : data;
        }
      }, true));
    };

    /**
     * @name byCategory
     * @description Query the transcriptic catalog
     * @param cat {string} Category string, retrieved from transcriptic (e.g. facets in a result)
     */
    self.byCategory = function (cat) {
      return $http.get(defaultUrl, Communication.defaultResourceActions({
        params : {
          c : cat
        },
        cache: true,
        transformResponse: function (data, headers, status) {
          return angular.isArray(data.results) ? data.results : data;
        }
      }, true));
    };

  });
