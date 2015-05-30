'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Database
 * @description
 * # Database
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('Database', function ($q, UUIDGen, Platform) {

    var self = this;

    //todo - all functions should ensure that have already authenticated

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
            Platform.userValue(key, val);
          }));
        } else {
          console.warn('missing some credentials - require: ' + requiredKeys.join(' '), creds);
        }
      }

      return $q.all(_.map(requiredKeys, function (val, key) {
        Platform.userValue(key);
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

    function getIdFromIdOrProjectInput (project) {
      return _.isString(project) ? project : _.result(project, 'metadata.id');
    }

    //can pass in whole project, if object assumes that
    self.getProject = function (project) {
      //check exists locally
      var id = getIdFromIdOrProjectInput(project);
      return Platform.getProject(id);
    };

    self.saveProject = function (project) {
      //todo - check exists, save if not
      return Platform.saveProject(project)
    };

    self.addProject = function (project) {
      //todo - save locally

    };

    self.removeProject = function (project) {
      var id = getIdFromIdOrProjectInput(project);
      if (id) {
        //fixme - pending Dion
        return Platform.deleteProject(id);
      }
    };

    /****
     large retrievals
     *****/

    //todo - cache
    self.getAllProjectIds = function getAllProjectIds () {
      return Platform.get_all_project_ids().
        then(function (rpc) {
          return rpc.result;
        });
    };

    //todo - cache / check for new IDs
    self.getAllProjects = function getAllProjects () {
      return self.getAllProjectIds().
        then(function (ids) {
          return $q.all(_.map(ids, Platform.getProject));
        });
    };

    //todo - cache / check for new IDs
    self.getAllProjectMetadata = function getAllProjectMetadata () {
      return self.getAllProjectIds().
        then(function (ids) {
          return $q.all(_.map(ids, Platform.getProjectMetadata));
        });
    };

    self.getAllProjectMetadataOfType = function getAllProjectMetadataOfType (type) {
      return self.getAllProjectMetadata().then(function (metas) {
        return _.filter(metas, {type : type});
      });
    };

    self.getAllProjectsOfType = function (type) {
      return self.getAllProjects().then(function (metas) {
        return _.filter(metas, {type : type});
      });
    };


    /****
     helpers / utils
     *****/

    self.projectOnlyHasMetadata = function (project) {
      var keys = _(project).keys().filter(function (key) {
        return !_.startsWith(key, '$');
      }).value();
      return keys.length == 1 && keys[0] == 'metadata';
    };

    /*
    INIT
    On init, get all IDs and metadata for all objects
     */
    //todo

  });
