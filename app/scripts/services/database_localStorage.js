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
  .service('Database', function ($q, $window, UUIDGen) {

     var self     = this,
         ls = $window.localStorage,
         cache = {},
         pathToId = 'metadata.id',
         ls_prefix ='wla_';

    //this release does not rely on this cache, though using it could potentially optimize the application. However, running from localStorage, this is likely not to be an issue unless you have a large amount of data saved.
     self.cache = cache;

    //this will remove $$ prefixed fields, which should prevent circular references
    self.removeExtraneousFields = function removeExtraneousFields (object) {
      return angular.fromJson(angular.toJson(object));
    };

    //create an account if one doesn't exist
    self.dummyAccount = function userCredentials (callback) {
      var credsKey = 'creds';
      var retrieved = ls_get(credsKey);

      if (!retrieved) {
        var newCreds = {
          uid: UUIDGen(),
          name: 'WLA User'
        };
        retrieved = ls_set(credsKey, newCreds);
      }

      callback(retrieved);
    };

    /**
     *
     * @description getter/setter for transcriptic credentials. Pass object with kPlatfeys {email, organization, key} to set
     * @returns {Promise<Object>} Promise with {email, organization, key}
     */
    self.transcripticCredentials = function transcripticCredentials (creds) {
      var requiredKeys = ['email', 'key', 'organization'],
          transcripticKey = 'transcriptic';

      if (_.isObject(creds)) {
        if (_.every(requiredKeys, _.partial(_.has, creds))) {
          return $q.when(ls_set(transcripticKey, creds));
        } else {
          console.warn('missing some credentials - require: ' + requiredKeys.join(' '), creds);
        }
      }

      return $q.when(ls_get(transcripticKey));
    };

    /****
     basic CRUD
     *****/

      //can pass in whole project, if object assumes that
    self.getProject = function (project) {
      //check exists locally
      var id     = getIdFromIdOrProjectInput(project),
          cached = _.result(cache, id);

      if (cached && !projectOnlyHasMetadata(cached)) {
        return $q.when(project);
      } else {
        return $q.when(ls_get(id)).then(saveProjectToCache);
      }
    };

    //accepts id only
    self.getProjectMetadata = function (project) {
      //this existed for speed reasons, but don't have the ability to only get metadata from local storage, so just passing directly so getProject
      return self.getProject(project);
    };

    //check for id, set if unset, and return project
    self.saveProject = function (project) {
      var id = ensureProjectId(project);
      return $q.when(ls_set(id, self.removeExtraneousFields(project)))
                     .then(saveProjectToCache);
    };

    //returns ID
    self.removeProject = function (project) {
      var id = getIdFromIdOrProjectInput(project);
      if (id) {
        return $q.when(ls_remove(id))
                       .then(function () {
                         removeProjectFromCache(project);
                       })
      } else {
        return $q.reject('missing id');
      }
    };

    /****
     large retrievals
     *****/

    self.getAllProjectIds = function getAllProjectIds () {
      var ids = [];
      for ( var i = 0, len = ls.length; i < len; ++i ) {
        var val = ls.key(i);
        if (val.indexOf(ls_prefix) == 0) {
          ids.push(val.substring(ls_prefix.length));
        }
      }
      return $q.when(ids);
    };

    self.getAllProjects = function getAllProjects () {
      return self.getAllProjectIds().
      then(function (ids) {
        return $q.all(_.map(ids, self.getProject))
                 //in case one rejects, let the retrieved ones fall through
                 //hack
                 .catch(function () {
                   console.error('error loading all projects', cache);
                   return _.map(ids, retrieveFromCache);
                 });
      });
    };

    self.getAllProjectMetadata = function getAllProjectMetadata () {
      return self.getAllProjectIds().
      then(function (ids) {
        return $q.all(_.map(ids, self.getProjectMetadata))
                 //in case one rejects, let the rest fall through
                 //hack
                 .catch(function () {
                   console.error('error loading all project metadata', cache);
                   return _.map(ids, retrieveFromCache);
                 });
      });
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

    function ensureProjectId (project) {
      var id = getIdFromIdOrProjectInput(project);
      if (!id) {
        _.set(project, pathToId, UUIDGen());
      }
      return _.result(project, pathToId);
    }

    function retrieveFromCache (project) {
      var id = getIdFromIdOrProjectInput(project);
      return _.result(cache, id);
    }

    //given an id, returns function which will assign value to cache under id, creating if necessary
    function assignToCacheIdPartial (id) {
      return function (data) {
        if (!_.has(cache, id)) {
          cache[id] = {};
        }
        return _.assign(cache[id], data);
      };
    }

    function saveProjectToCache (project) {
      var id = getIdFromIdOrProjectInput(project);
      if (_.isEmpty(id)) {
        console.warn('project has no id', project);
        return project;
      }

      if (!_.has(cache, id)) {
        cache[id] = {};
      }
      return _.assign(cache[id], project);
    }

    function removeProjectFromCache (project) {
      var id = getIdFromIdOrProjectInput(project);
      if (_.isEmpty(id)) {
        return;
      }
      if (id) {
        delete cache[id];
      }
      return id;
    }

    function getIdFromIdOrProjectInput (project) {
      return _.isString(project) ? project : _.result(project, pathToId);
    }

    function projectOnlyHasMetadata (project) {
      var keys = _(project).keys().filter(function (key) {
        return !_.startsWith(key, '$');
      }).value();
      return keys.length == 1 && keys[0] == 'metadata';
    }
  });