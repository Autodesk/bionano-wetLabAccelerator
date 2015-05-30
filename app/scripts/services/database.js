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

    //todo - cache
    self.getAllProjectIds = function getAllProjectIds () {
      return Platform.get_all_project_ids().
        then(function (rpc) {
          return rpc.result;
        });
    };

    //todo - cache
    self.getAllProjectMetadata = function getAllProjectMetadata () {
      return self.getAllProjectIds().
        then(function (ids) {
          return $q.all(_.map(ids, Platform.getProject));
        });
    };

    self.getAllProjectMetadataOfType = function getAllProjectMetadataOfType (type) {
      return self.getAllProjectMetadata().then(function (metas) {
        return _.filter(metas, {type : type});
      });
    };

    self.getProjectById = function getProjectById (id) {
      return Platform.getProject(id);
    };

    self.saveProject = function (project) {
      //todo - check exists, save if not
      return Platform.saveProject(project)
    };

    self.createProject = function (project) {
      //todo - save locally

    };

    /* INIT
    On init, get all IDs and metadata for all objects
     */
    //todo

  });
