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

    _.assign(self, pc);

    self.isCompliantId = function (id) {
      return (/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).test(id);
    };

    self.transcripticCredentials = function (creds) {
      var requiredKeys = ['email', 'key', 'organization'];
      if (_.isObject(creds)) {
        if (_.every(requiredKeys, _.partial(_.has, creds))) {
          return $q.all(_.map(creds, function (val, key) {
            pc.set_user_value(key, val);
          }));
        } else {
          console.warn('missing some credentials - require: ' + requiredKeys.join(' '), creds);
        }
      }

      return $q.all(_.map(requiredKeys, function (val, key) {
        pc.get_user_value(key);
      }));
    }




  });
