'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txInstruction
 * @description
 * # txInstruction
 */
angular.module('transcripticApp')
  .directive('txInstruction', function (StorageOptions) {
    return {
      templateUrl: 'views/tx-instruction.html',
      restrict: 'E',
      scope: {
        protocol: '=',
        instructionIndex: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.instruction = scope.protocol.instructions[scope.instructionIndex];

        scope.containers = scope.protocol.refs;

        scope.storageOptions = StorageOptions.storage;
      }
    };
  });
