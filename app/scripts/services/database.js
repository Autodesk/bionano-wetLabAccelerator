'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Database
 * @description
 * # Database
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('Database', function ($q, UUIDGen, Platform, Authentication) {

    var self  = this,
        cache = {},
        pathToId = 'metadata.id';

    //todo - expose cache for binding

    //todo - all functions should ensure that have already authenticated - use a facade of platform?

    Authentication.watch(function () {
      //on user change, clear local cache

      //todo should also clear all outstanding requests

      _.forEach(_.keys(cache), function (key) {
        delete cache.key;
      });
    });

    /**
     *
     * @description getter/setter for transcriptic credentials. Pass object with keys {email, organization, key} to set
     * @returns {Promise<Object>} Promise with {email, organization, key}
     */
    self.transcripticCredentials = function transcripticCredentials (creds) {
      var requiredKeys = ['email', 'key', 'organization'];
      if (_.isObject(creds)) {
        if (_.every(requiredKeys, _.partial(_.has, creds))) {
          return $q.all(_.map(creds, function (val, key) {
            return Platform.userValue(key, val);
          }));
        } else {
          console.warn('missing some credentials - require: ' + requiredKeys.join(' '), creds);
        }
      }

      return $q.all(_.map(requiredKeys, function (key, index) {
        return Platform.userValue(key);
      }));
    };

    //remove angular / firebase fields
    self.removeExtraneousFields = function removeExtraneousFields (object) {
      if (_.isObject(object)) {
        return _.omit(object, function (val, key) {
          return _.startsWith(key, "$");
        });
      }
      return object;
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
        return Platform.getProject(id)
          .then(saveProjectToCache);
      }
    };

    //accepts id only
    self.getProjectMetadata = function (project) {
      var id     = getIdFromIdOrProjectInput(project),
          cached = _.result(cache, id);

      if (!_.isEmpty(cached)) {
        return $q.when(cached);
      } else {
        return Platform.getProjectMetadata(id)
          .then(function (meta) {
            //wrap metadata so that has same format as a complete project
            return {metadata: meta};
          })
          .then(saveProjectToCache);
      }
    };

    //check for id, set if unset, and return project
    self.saveProject = function (project) {
      ensureProjectId(project);
      return Platform.saveProject(self.removeExtraneousFields(project))
        .then(saveProjectToCache);
    };

    //returns ID
    self.removeProject = function (project) {
      var id = getIdFromIdOrProjectInput(project);
      if (id) {
        return Platform.deleteProject(id)
          .then(removeProjectFromCache)
      } else {
        return $q.reject('missing id');
      }
    };

    /****
     large retrievals
     *****/

    self.getAllProjectIds = function getAllProjectIds (useCache) {
      var ids     = _.keys(cache),
          request = Platform.getAllProjectIds()
            .then(function (ids) {
              _.forEach(ids, function (id) {
                //update the cache
                _.set(cache, id, {});
                //update the object we send back if not useCache
                ids.push(id)
              });
              return ids;
            });

      return !!useCache ? $q.when(ids) : request;
    };

    self.getAllProjects = function getAllProjects (useCache) {
      return self.getAllProjectIds(useCache).
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

    self.getAllProjectMetadata = function getAllProjectMetadata (useCache) {
      return self.getAllProjectIds(useCache).
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

    self.getAllProjectMetadataOfType = function getAllProjectMetadataOfType (type, useCache) {
      return self.getAllProjectMetadata(useCache).then(function (metas) {
        return _.filter(metas, {type: type});
      });
    };

    self.getAllProjectsOfType = function (type, useCache) {
      return self.getAllProjects(useCache).then(function (metas) {
        return _.filter(metas, {type: type});
      });
    };


    /****
     helpers / utils
     *****/

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
