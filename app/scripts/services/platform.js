'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Platform
 * @description
 * # Platform
 * Service in the transcripticApp.
 *
 * Generally, you should use the database service, and not this directly...
 *
 */
angular.module('transcripticApp')
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
        'get_all_project_ids',
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

    //deprecated. You should use platform /facebook instead. this is for debugging.
    self.unauthenticate = function () {
      return $q.when(pc.unauthenticate());
    };

    self.getUserInfo = function () {
      return pc.get_user()
        .then(function (result) {
          return result.data;
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
