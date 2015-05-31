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

    //expose direct functionality if we want it...
    //todo - deprecate this.
    _.assign(self, pc);

    /* Facade */

    //note - should use Authentication service, not this directly
    self.authenticate = function (userstring) {
      return pc.authenticate(userstring);
    };

    self.unauthenticate = function () {
      //fixme - pending dion
    };

    self.getUserInfo = function () {
      return pc.get_user().then(function (result) {
        return result.data;
      });
    };

    self.userValue = function userValue (key, value) {
      if (!_.isUndefined(value)) {
        return pc.set_user_value(key, value).
          then(function () {
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

    self.getProject = pc.getProject;

    self.getProjectMetadata = pc.getProjectMetadata;

    self.saveProject = pc.saveProject;

    self.deleteProject = pc.deleteProject;

    /* helpers */

    //check if UUID is RFC v4 compliant
    self.isCompliantId = function isCompliantId (id) {
      return (/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).test(id);
    };

  });
