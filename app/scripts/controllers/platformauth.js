'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:PlatformauthCtrl
 * @description
 * # PlatformauthCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('PlatformAuthCtrl', function ($scope, Authentication, Database) {

    var self = this;

    //todo - lets include their name temporarily?

    self.setUser = function (userstring) {
      Authentication.authenticate(userstring || self.userString);
    };

    Authentication.watch(function PlatformAuthCtrl_AuthWatcher (creds) {
      $scope.$applyAsync(function () {
        self.isAuthenticated = !_.isEmpty(creds);
        self.userString = _.result(creds, 'token');
      });
    });

    self.unauthenticate = function () {
      Authentication.unauthenticate();
    };

  });
