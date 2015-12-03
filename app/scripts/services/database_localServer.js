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
 * @name wetLabAccelerator.Database
 * @description
 * # Database
 * Service in the wetLabAccelerator.
 *
 * The version in this release relies on localStorage, which is slow and synchronous. A much better implementation would be to use a database running on another thread or remotely.
 */
angular.module('wetLabAccelerator')
  .service('Database', function ($q, $http, $window, UUIDGen) {

    var self     = this;
    var pathToId = 'metadata.id';

    //note that these are saved as files... and are retrieved e.g. in content menu but pruned out... may want to save / retrieve these separately, this is a very simple way of handling
    var credsKey = 'wlaCredentials';
    var transcripticKey = 'transcripticCredentials';

    //this will remove $$ prefixed fields, which should prevent circular references
    self.removeExtraneousFields = function removeExtraneousFields (object) {
      return angular.fromJson(angular.toJson(object));
    };

    //stub for account management... but for this, we're essentially just allowing one account
    self.dummyAccount = function userCredentials (callback) {

      dbGet(credsKey)
        .catch(function () {
          var newCreds = {
            uid: UUIDGen(),
            name: 'WLA User'
          };
          return dbSet(credsKey, newCreds)
        })
        .then(function (creds) {
          console.log(creds);
          callback(creds);
        });
    };

    /**
     *
     * @description getter/setter for transcriptic credentials. Pass object with kPlatfeys {email, organization, key} to set
     * @returns {Promise<Object>} Promise with {email, organization, key}
     */
    self.transcripticCredentials = function transcripticCredentials (creds) {
      var requiredKeys = ['email', 'key', 'organization'];

      if (_.isObject(creds)) {
        if (_.every(requiredKeys, _.partial(_.has, creds))) {
          return dbSet(transcripticKey, creds);
        } else {
          console.warn('missing some credentials - require: ' + requiredKeys.join(' '), creds);
        }
      }

      return dbGet(transcripticKey);
    };

    /****
     basic CRUD
     *****/

      //can pass in whole project, if object assumes that
    self.getProject = function (project, limitToField) {
      //check exists locally
      var id     = getIdFromIdOrProjectInput(project);

      return dbGet(id, limitToField);
    };

    //accepts id only
    self.getProjectMetadata = function (project) {
      //this existed for speed reasons, but skipping ability to do this now
      return self.getProject(project, 'metadata');
    };

    //check for id, set if unset, and return project
    self.saveProject = function (project) {
      var id = ensureProjectId(project);
      return dbSet(id, self.removeExtraneousFields(project));
    };

    //returns ID
    self.removeProject = function (project) {
      var id = getIdFromIdOrProjectInput(project);
      return dbRemove(id);
    };

    /****
     large retrievals
     *****/

    self.getAllProjectIds = function getAllProjectIds () {
      return $http.get('/files?pluck=metadata.id').then(function (data) { return data.data });
    };

    self.getAllProjects = function getAllProjects () {
      return $http.get('/files').then(function (data) { return data.data });
    };

    self.getAllProjectMetadata = function getAllProjectMetadata () {
      return $http.get('/files?pluck=metadata').then(function (data) { return data.data });
    };

    self.getAllProjectMetadataOfType = function getAllProjectMetadataOfType (type) {
      return self.getAllProjectMetadata().then(function (metas) {
        return _.filter(metas, {type: type});
      });
    };

    self.getAllProjectsOfType = function (type) {
      return self.getAllProjects().then(function (metas) {
        return _.filter(metas, {type: type});
      });
    };


    /****
     helpers / utils
     *****/

    function dbSet (key, value) {
      if (!key) {
        return $q.reject('no id');
      }

      return $http({
        url : 'file/' + key,
        method: 'POST',
        data: value
      }).then(function (data) {
        return data.data;
      });
    }

    function dbGet (key, limitToField) {
      if (!key) {
        return $q.reject('no id');
      }

      var params = typeof limitToField === 'string' ?
                   {pluck : limitToField} :
                   {};

      return $http({
        method: 'GET',
        url: 'file/' + key,
        params: params
      }).then(function (data) {
        return data.data;
      });
    }

    function dbRemove (key) {
      if (!key) {
        return $q.reject('no id');
      }
      return $http({
        method: 'DELETE',
        url: 'file/' + key
      });
    }

    /*
    //returns value given as argument
    function ls_set (key, value) {
      try {
        ls.setItem(ls_prefix + key, JSON.stringify(value));
        return value;
      } catch (e) {
        alert (e);
      }
    }

    //returns parsed value
    function ls_get (key) {
      try {
        return JSON.parse(ls.getItem(ls_prefix + key));
      } catch (e) {
        alert(e);
      }
    }

    function ls_remove (key) {
      try {
        ls.removeItem(ls_prefix + key);
        return key;
      } catch (e) {
        alert (e);
      }
    }
    */

    function ensureProjectId (project) {
      var id = getIdFromIdOrProjectInput(project);
      if (!id) {
        _.set(project, pathToId, UUIDGen());
      }
      return _.result(project, pathToId);
    }

    function getIdFromIdOrProjectInput (project) {
      return _.isString(project) ? project : _.result(project, pathToId);
    }
  });