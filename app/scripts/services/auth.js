'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Auth
 * @description
 * # Auth
 * Service in the transcripticApp.
 */
angular.module('transcripticApp').service('Auth', function () {

  var self = this;

  //future - use getter setters for some security
  this.email = "max.bates@autodesk.com";
  this.key = "U4J-_G7vy-CKZwQsDNMw";

  this.organization = "autodesk-cyborg";

  this.headers = function () {
    return {
      "X-User-Email": self.email,
      "X-User-Token": self.key,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
  };
});
