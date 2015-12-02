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
 * @name wetLabAccelerator.Order
 * @description
 * # Order
 * Factory in the wetLabAccelerator.
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
