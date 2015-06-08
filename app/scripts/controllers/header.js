'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('HeaderCtrl', function ($scope, $window, $location, Authentication) {

    var self = this;

    $scope.$on('$locationChangeSuccess', function () {
      self.currentPath = $location.path();
    });

    Authentication.watch(function (info) {
      console.log(info);
      self.currentAuth = (!!info) ? info : null;
    });

    self.unauthenticate = function () {
      Authentication.unauthenticate().then(function () {
        $window.location.href = '/logout';
      })
    }
  });
