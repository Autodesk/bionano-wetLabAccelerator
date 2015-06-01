'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.TranscripticAuth
 * @description
 * # TranscripticAuth
 * Service in the transcripticApp.
 */
angular.module('tx.communication')
  .provider('TranscripticAuth', function () {

    var self = this;

    var requiredKeys = ['email', 'key', 'organization'];

    function allKeysDefined () {
      return _.every(requiredKeys, function (key) {
        return self[key] && self[key].length;
      });
    }

    self.email        = "";
    self.key          = "";
    self.organization = "";


    this.$get = function ($rootScope, Platform, Authentication, $q) {

      var ignoreWatchers = false;

      var organization = function (newval) {
        if (_.isString(newval)) {
          self.organization = newval;
          triggerWatchers();
        }
        return self.organization.toLowerCase().replace(' ', '-');
      };

      var email = function (newval) {
        if (_.isString(newval)) {
          self.email = newval;
          triggerWatchers();
        }
        return self.email;
      };

      var key = function (newval) {
        if (_.isString(newval)) {
          self.key = newval;
          triggerWatchers();
        }
        return self.key;
      };

      var headers = function () {
        return {
          "X-User-Email": email,
          "X-User-Token": key,
          "Content-Type": "application/json",
          "Accept"      : "application/json"
        };
      };

      Authentication.watch(function (userinfo) {
        console.log('auth watch in tx auth', userinfo);
        batchUpdate({
          organization: _.result(userinfo, 'transcripticOrg', ''),
          email       : _.result(userinfo, 'transcripticEmail', ''),
          key         : _.result(userinfo, 'transcripticKey', '')
        });
      });

      /* set up handling for watchers when auth changes */

      var watchers    = [],
          lastPayload = {
            organization: self.organization,
            email       : self.email,
            key         : self.key
          };

      function makePayload () {
        /*
        //only return if all keys are defined.
        return allKeysDefined() ? {
          organization: self.organization,
          email       : self.email,
          key         : self.key
        } : null;
        */
        //return even if not all keys defined
        return {
          organization: self.organization,
          email       : self.email,
          key         : self.key
        }
      }

      function triggerWatcher (fn) {
        fn(lastPayload);
      }

      function triggerWatchers () {
        if (!ignoreWatchers) {
          var newPayload = makePayload();
          if (!angular.equals(newPayload, lastPayload)) {
            lastPayload = newPayload;
            angular.forEach(watchers, triggerWatcher);
          }
        }
      }

      var watch = function (cb, $scope) {
        triggerWatcher(cb);
        watchers.push(cb);
        var unbind = function () {
          var i = watchers.indexOf(cb);
          if (i > -1) {
            watchers.splice(i, 1);
          }
        };
        if ($scope) {
          $scope.$on('$destroy', unbind);
        }
        return unbind;
      };

      var forgetCreds = function forgetCreds () {
        batchUpdate({
          organization: '',
          email       : '',
          key         : ''
        })
      };

      function batchUpdate (creds, skipUpdate) {
        ignoreWatchers = true;
        angular.forEach(creds, function (val, key) {
          if (angular.isDefined(self[key])) {
            self[key] = val;
          }
        });
        ignoreWatchers = false;

        (skipUpdate !== true) && triggerWatchers();
      }

      //save creds to the database
      var persistCreds = function persistCreds () {
        var keymap = {
          'email'       : 'transcripticEmail',
          'key'         : 'transcripticKey',
          'organization': 'transcripticOrg'
        };

        return $q.all(_.map(keymap, function (dbkey, txkey) {
          Platform.userValue(dbkey, self[txkey]);
        }));
      };

      return {
        organization: organization,
        key         : key,
        email       : email,
        headers     : headers,
        watch       : watch,
        batchUpdate : batchUpdate,
        forgetCreds : forgetCreds,
        persistCreds : persistCreds
      };
    }
  });
