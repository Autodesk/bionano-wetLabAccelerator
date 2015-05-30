'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Platform
 * @description
 * # Platform
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('Platform', function ($q, $window) {
    var self = this,
        pc   = $window.PlatformClient;

    //expose direct functionality if we want it...
    _.assign(self, pc);

    /* Facade */

    //note - should use Authentication service, not this directly
    self.authenticate = function (userstring) {
      return pc.authenticate(userstring);
    };

    self.getUserInfo = function () {
      return pc.get_user();
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

    /* helpers */

    //check if UUID is RFC v4 compliant
    self.isCompliantId = function isCompliantId (id) {
      return (/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).test(id);
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


  });
