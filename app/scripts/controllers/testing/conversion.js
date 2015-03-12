'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingConversionCtrl
 * @description
 * # TestingConversionCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingConversionCtrl', function ($scope, $http, Autoprotocol, AbstractionUtils) {
    $http.get('abstraction/protocol_transfer.json').success(function (data) {

      //for working with steps
      //var protocol = AbstractionUtils.wrapGroupsInProtocol(AbstractionUtils.wrapOpInGroup(data));
      //var converted = Autoprotocol.fromAbstraction(protocol);

      //for working with protocols
      var converted = Autoprotocol.fromAbstraction(data);

      console.log(JSON.stringify(converted, null, 2));
    });
  });
