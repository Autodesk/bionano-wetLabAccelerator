'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingConversionCtrl
 * @description
 * # TestingConversionCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingConversionCtrl', function ($scope, $http, Autoprotocol) {
    $http.get('abstraction/protocol_transfer.json').success(function (data) {
      var converted = Autoprotocol.fromAbstraction(data);
      console.log(converted);
    });
  });
