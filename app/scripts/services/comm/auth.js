'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Auth
 * @description
 * # Auth
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .provider('Auth', function () {

  var self = this;

  var email = "",
      key = "",
      organization = "";

  //todo - more validation + security
  Object.defineProperties(this, {
    email: {
      get: function () {
        return email;
      },
      set: function (val) {
        if (angular.isString(val)) {
          email = val
        }
      }
    },
    key: {
      get: function () {
        return key;
      },
      set: function (val) {
        if (angular.isString(val)) {
          key = val
        }
      }
    },
    organization: {
      get: function () {
        return organization;
      },
      set: function (val) {
        if (angular.isString(val)) {
          organization = val;
        }
      }
    }
  });

  this.$get = function ($rootScope, simpleLogin, FBProfile) {

    var organization = function (newval) {
      if (newval) {
        self.organization = newval;
        triggerWatchers();
      }
      return self.organization;
    };

    var email = function (newval) {
      if (newval) {
        self.email = newval;
        triggerWatchers();
      }
      return self.email;
    };

    var key = function (newval) {
      if (newval) {
        self.key = newval;
        triggerWatchers();
      }
      return self.key;
    };

    //todo - closure issues / security?
    var headers = function () {
      return {
        "X-User-Email": this.email,
        "X-User-Token": this.key,
        "Content-Type": "application/json",
        "Accept": "application/json"
      };
    };

    //listen to firebase for changes to auth and assign directly (don't trigger watchers twice)
    simpleLogin.watch(function(user) {
      if (!!user) {
        var txAuth = new FBProfile(user.uid, 'txAuth').$asObject();
        txAuth.$watch(function () {
          angular.forEach(txAuth, function (val, key) {
            if (angular.isDefined(self[key])) {
              self[key] = val;
            }
          });
          triggerWatchers();
        });
      }
    });

    /* set up handling for watchers when auth changes */

    var watchers = [];
    function triggerWatcher (fn) {
      fn({
        organization : self.organization,
        email: self.email,
        key : self.key
      });
    }
    function triggerWatchers () {
      angular.forEach(watchers, triggerWatcher);
    }

    var watch = function (cb, $scope) {
      triggerWatcher(cb);
      watchers.push(cb);
      var unbind = function() {
        var i = watchers.indexOf(cb);
        if( i > -1 ) { watchers.splice(i, 1); }
      };
      if( $scope ) {
        $scope.$on('$destroy', unbind);
      }
      return unbind;
    };

    return {
      organization: organization,
      key: key,
      email: email,
      headers: headers,
      watch: watch
    };
  }
});
