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
 * @name wetLabAccelerator.Container
 * @description
 * # Container
 * Factory in the wetLabAccelerator.
 */
angular.module('tx.communication')
  .factory('Container', function ($resource, Communication, TranscripticAuth) {

    return $resource(Communication.root + ':organization/samples',
      //defaults
      {
        organization: TranscripticAuth.organization
      },

      //actions
      {
        /**
         * @name list
         * @description Get a list of all containers
         */
        list: Communication.defaultResourceActions({
          method: "GET",
          isArray: true,
          transformResponse: function (data, headers) {
            //todo - check for more than 1 page / pass param for more than 10
            return angular.isArray(data.results) ? data.results : data;
          }
        }),

        /**
         * @name view
         * @description Get details about a container
         * @param parameters {Object} consisting of:
         * id {String} Container
         */
        view: Communication.defaultResourceActions({
          method: "GET",
          url: Communication.root + ':organization/samples/:id'
        }),

        /**
         * @name view
         * @description Get details about a container
         * @param parameters {null}
         * @param payload {Object} consisting of:
         * container_type {String} Container shortname
         * test_mode {Boolean} Whether container is in test_mode
         */
        create: Communication.defaultResourceActions({
          method: "POST"
        })
      });
  });
