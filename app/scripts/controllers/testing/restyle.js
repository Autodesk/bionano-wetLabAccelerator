'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingRestyleCtrl
 * @description
 * # TestingRestyleCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingRestyleCtrl', function ($scope, simpleLogin, FBProfile) {
    var self = this;

    simpleLogin.watch(function(user) {
      if (!!user) {
        self.firebaseProtocolSync = new FBProfile(user.uid, 'protocols');
        self.firebaseProtocols = self.firebaseProtocolSync.$asArray();
      }
    });
  });
