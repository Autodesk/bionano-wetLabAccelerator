'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingRestyleCtrl
 * @description
 * # TestingRestyleCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingRestyleCtrl', function ($scope, $http, simpleLogin, FBProfile) {
    var self = this;

    simpleLogin.watch(function(user) {
      if (!!user) {
        self.firebaseProtocolSync = new FBProfile(user.uid, 'protocols');
        self.firebaseProtocols = self.firebaseProtocolSync.$asArray();
      }
    });

    $http.get('abstraction/protocol_transfer.json').success(function (d) {
      self.currentProtocol = d;
    })
  });
