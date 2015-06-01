'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingRestyleCtrl
 * @description
 * # TestingRestyleCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('ProtocolCtrl', function ($scope, $http, ProtocolHelper) {
    var self = this;

    self.currentProtocol = ProtocolHelper.currentProtocol;

    self.loadDemo = function () {
      $http.get('demo_protocols/omniprotocol/protocol_dummy.json').success(function (d) {
        ProtocolHelper.assignCurrentProtocol(d);
      });
    };

    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };

    //self.loadDemo();
  });
