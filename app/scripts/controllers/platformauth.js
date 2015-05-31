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

    Authentication.watch(function PlatformAuthCtrl_AuthWatcher(creds) {
      console.log('new user!', creds);
      //testing
      creds && Database.getAllProjectMetadataOfType('project').then(function (result) {
        console.log('results!', result);
      });
    });

  });
