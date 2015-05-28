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

    self.setTranscripticCredentials = function (creds) {
      var requiredKeys = ['email', 'key', 'organization'];
      if (_.every(requiredKeys, _.partial(_.has, creds))) {
        return $q.all(_.map(creds, function (val, key) {
          pc.set_user_value(key, val);
        }));
      } else {
        console.warn('missing some credentials - require: ' + requiredKeys.join(' '), creds);
      }
    };



  });
