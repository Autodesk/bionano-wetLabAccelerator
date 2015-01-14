'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Auth
 * @description
 * # Auth
 * Service in the transcripticApp.
 */
angular.module('transcripticApp').provider('Auth', function () {

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

  this.$get = function () {

    var organization = function (newval) {
      if (newval) { self.organization = newval; }
      return self.organization;
    };

    var email = function (newval) {
      if (newval) { self.email = newval; }
      return self.email;
    };

    var key = function (newval) {
      if (newval) { self.key = newval; }
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

    return {
      organization: organization,
      key: key,
      email: email,
      headers: headers
    };
  }
});
