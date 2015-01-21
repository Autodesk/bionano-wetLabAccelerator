'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('AuthCtrl', function ($scope, simpleLogin, FBProfile) {
    //don't actually bind to Auth here, Auth listens to 'txAuth' from firebase directly
    var bindtoWatcher = angular.noop;
    simpleLogin.watch(function(user) {
      if (!!user) {
        bindtoWatcher();
        bindtoWatcher = new FBProfile(user.uid, 'txAuth').$asObject().$bindTo($scope, 'auth');
      }
    });
  });
