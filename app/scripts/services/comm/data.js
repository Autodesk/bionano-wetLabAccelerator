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
  .factory('Data', function ($resource, ContainerOptions, Communication, TranscripticAuth) {

    return $resource(Communication.root + ':organization/:project/runs/:run/data',
      //defaults
      {
        organization: TranscripticAuth.organization
      },

      //actions
      {
        /**
         * @name run
         * @description Get details about a run
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         * run {String} Run ID
         */
        run: Communication.defaultResourceActions({
          method: "GET"
        }),

        /**
         * @name dataref
         * @description Get details about a dataref (i.e. one part of a run)
         * @param parameters {Object} consisting of:
         * dataref {String} dataref ID
         */
        dataref: Communication.defaultResourceActions({
          url: Communication.root + "data/:dataref",
          method: "GET"
        })
      });
  });
