'use strict';

/**
 * @ngdoc function
 * @name wetLabAccelerator.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('HeaderCtrl', function ($scope, $rootScope, $window, $location, Authentication) {

    var self = this;

    $scope.$on('$locationChangeSuccess', function () {
      self.currentPath = $location.path();
    });

    Authentication.watch(function (info) {
      self.currentAuth = (!!info) ? info : null;
    });

    self.unauthenticate = function () {
      Authentication.unauthenticate().then(function () {
        $window.location.href = '/logout';
      });
    };

    self.triggerCredentialsModal = function () {
      $rootScope.$broadcast('editor:toggleRunModal', true);
    }
  });
