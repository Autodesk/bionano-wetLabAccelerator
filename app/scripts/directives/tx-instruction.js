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

        scope.removeInstruction = function () {
          scope.protocol.instructions.splice(scope.instructionIndex, 1);
        };

        scope.duplicateInstruction = function () {
          scope.protocol.instructions.splice(scope.instructionIndex, 0, angular.copy(scope.instruction));
        };
      }
    };
  });
