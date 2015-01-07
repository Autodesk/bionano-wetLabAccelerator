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
        email = val
      }
    },
    key: {
      get: function () {
        return key;
      },
      set: function (val) {
        key = val
      }
    },
    organization: {
      get: function () {
        return organization;
      },
      set: function (val) {
        organization = val
      }
    }
  });

  this.$get = function () {
    return {
      "organization" : self.organization,
      "headers" : function () {
        return {
          "X-User-Email": self.email,
          "X-User-Token": self.key,
          "Content-Type": "application/json",
          "Accept": "application/json"
        };
      }
    }
  }
});
