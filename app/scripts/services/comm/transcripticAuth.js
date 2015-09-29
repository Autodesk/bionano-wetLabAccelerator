'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.TranscripticAuth
 * @description
 * # TranscripticAuth
 * Service in the wetLabAccelerator.
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


    this.$get = function ($rootScope, Authentication, Database, $q) {

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

      Authentication.watch(function () {
        Database.transcripticCredentials().then(function (creds) {
          batchUpdate({
            organization: _.result(creds, 'organization', ''),
            email       : _.result(creds, 'email', ''),
            key         : _.result(creds, 'key', '')
          });
        });
      });

      /* set up handling for watchers when auth changes */

      var watchers    = [],
          lastPayload = makePayload();

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
        }, true);
        persistCreds(true);
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
      var persistCreds = function persistCreds (shouldUpdate) {
        return Database.transcripticCredentials(_.assign({}, {
          email: self.email,
          key  : self.key,
          organization: self.organization
        })).then(function () {
          (shouldUpdate === true) && triggerWatchers();
        });
      };

      return {
        organization: organization,
        key         : key,
        email       : email,
        headers     : headers,
        watch       : watch,
        batchUpdate : batchUpdate,
        forgetCreds : forgetCreds,
        persistCreds: persistCreds
      };
    }
  })
/**
 * A directive that adds a class when a user is logged in to transcriptic
 * use attribute tx-unauth for valid on unauth
 * e.g. use tx-hide-auth="ng-hide" to hide element when authenticated
 */
  .directive('txClassAuth', function (TranscripticAuth, Communication, $timeout) {
    var isLoggedIn;
    TranscripticAuth.watch(function (user) {
      isLoggedIn = Communication.validate()
        .then(function authValid () {
          return true;
        }, function authNotValid () {
          return false;
        });
    });

    return {
      restrict: 'A',
      link    : function (scope, el, attrs) {

        function update () {
          isLoggedIn.then(function (isValid) {
            el.toggleClass(attrs.txClassAuth, (angular.isDefined(attrs.txUnauth) ? !isValid : isValid));
          });
        }

        update();
        TranscripticAuth.watch(update, scope);
      }
    };
  });
