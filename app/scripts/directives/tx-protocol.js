'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocol
 * @description
 * # txProtocol
 */

angular.module('transcripticApp')
  .directive('txProtocol', function (InstructionOptions) {
    return {
      templateUrl: 'views/tx-protocol.html',
      restrict: 'E',
      scope: {
        protocol: '='
      },
      link: function (scope, element, attrs) {

        scope.allStepsVisibleState = true;

        scope.toggleInstructionCollapsed = function () {
          scope.allStepsVisibleState = !scope.allStepsVisibleState;
          scope.$broadcast('instruction:toggleVisible', scope.allStepsVisibleState)
        };

        scope.instructionOptions = Object.keys(InstructionOptions);

        //sortable options

        scope.instructionSortableOptions = {
          axis: 'y',
          scroll: true,
          handle: '.drag-handle'
        };

        scope.newSortableOptions = {
          scroll: true,
          connectWith: ".instructionDropTarget",
          update: function (e, ui) {
            //reset the list
            // note - previously, was cancelling and listening for receive event,
            // but issues with setting model and ui-sortable in sync
            scope.instructionOptions = Object.keys(InstructionOptions);
          },
          stop: function (e, ui) {
            var type = ui.item.sortable.model,
              dropIndex = ui.item.sortable.dropindex;

            //todo - logic for handling pipette subtasks

            //hack - probably a better way. ng-include trying to get empty template unless has ng-if
            scope.$apply(function () {
              //need to replace here so that ng-model + ui-sortable stay in sync
              scope.protocol.instructions[dropIndex] = {
                op: type
              };
            });
          }
        };

      }
    };
  });
