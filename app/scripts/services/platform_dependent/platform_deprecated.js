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
 * @name wetLabAccelerator.Platform
 * @description
 * # Platform
 * Service in the wetLabAccelerator.
 *
 * Generally, you should use the database service, and not this directly...
 *
 */
angular.module('wetLabAccelerator')
  .service('Platform', function ($q, $window) {
    var self = this,
        pc   = $window.PlatformClient;

    if (_.isUndefined(pc)) {
      //todo - should use ES6 proxies when available
      _.forEach([
        'authenticate',
        'isAuthenticated',
        'unauthenticate',
        'get_user',
        'set_user_value',
        'get_user_value',
        'get_all_value_fields',
        'get_all_project_ids',
        'getAllProjectMetadata',
        'getAllProjectIds',
        'getProject,',
        'getProjectMetadata,',
        'saveProject,,',
        'deleteProject,'
      ], _.partial(_.set, pc, _, $q.reject));
    }

    /* Facade */

    //note - should use Authentication service, not this directly
    //deprecated. You should use platform / facebook instead. this is for debugging.
    self.authenticate = function (userstring) {
      return pc.authenticate(userstring);
    };

    self.isAuthenticated = function () {
      return pc.isAuthenticated();
    };

    self.unauthenticate = function () {
      return $q.when(pc.unauthenticate());
    };

    self.getUserInfo = function () {
      return pc.get_user()
        .then(function (result) {
          return _.assign(result.data, {uid: result.uid});
        });
    };

    self.userValue = function userValue (key, value) {
      if (!_.isUndefined(value)) {
        return pc.set_user_value(key, value)
          .then(function () {
            return value;
          });
      }
      return pc.get_user_value(key);
    };

    self.getAllProjectIds = function () {
      return pc.get_all_project_ids()
        .then(function (rpc) {
          return rpc.result;
        });
    };

    self.getAllProjectMetadata = function () {
      return pc.getAllProjectMetadata();
    };

    self.getProject = function (id) {
      return pc.getProject(id);
    };

    self.getProjectMetadata = function (id) {
      return pc.getProjectMetadata(id);
    };

    self.saveProject = function (project) {
      return pc.saveProject(project)
        .then(function (id) {
          return project;
        });
    };

    self.deleteProject = function (id) {
      return pc.deleteProject(id);
    };

    /* helpers */

    //check if UUID is RFC v4 compliant
    self.isCompliantId = function isCompliantId (id) {
      return (/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).test(id);
    };

  });
