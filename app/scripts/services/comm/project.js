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
 * @name wetLabAccelerator.Project
 * @description
 * # Project
 * Factory in the wetLabAccelerator.
 */
angular.module('tx.communication')
  .factory('Project', function ($resource, Communication, TranscripticAuth) {
    return $resource(Communication.root + ':organization',
      //defaults
      {
        organization: TranscripticAuth.organization
      },

      //defaults
      {
        /**
         * @name create
         * @description Create a new project
         * @param parameters {null} empty object
         * @param postData {Object} consisting of:
         * name {String} name of new project
         */
        create: Communication.defaultResourceActions({
          method: "POST"
        }),

        /**
         * @name view
         * @description Get data about a project
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         */
        view: Communication.defaultResourceActions({
          method: "GET",
          url   : Communication.root + ':organization/:project'
        }),

        /**
         * @name list
         * @description Get list of projects
         */
        list: Communication.defaultResourceActions({
          method           : "GET",
          url              : Communication.root + ':organization/projects',
          isArray          : true,
          /*
          //debug
          transformRequest : function (data, headers) {
            console.log(data);
            console.log(headers());
          },
          */
          transformResponse: function (data, headers) {
            //todo - check for more than 1 page / pass param for more than 10
            return angular.isArray(data.results) ? data.results : data;
          }
        }),

        /**
         * @name remove
         * @description Delete a project
         * @param parameters {Object} consisting of:
         * project {String} Project ID
         */
        remove: Communication.defaultResourceActions({
          method: "DELETE",
          url   : Communication.root + ':organization/:project'
        })
      });
  });
