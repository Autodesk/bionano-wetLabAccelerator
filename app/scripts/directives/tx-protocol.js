'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocol
 * @description
 * # txProtocol
 */

angular.module('transcripticApp')
  .directive('txProtocol', function (InstructionOptions, $window, $timeout) {
    return {
      templateUrl: 'views/tx-protocol.html',
      restrict: 'E',
      scope: {
        protocol: '=',
        meta: '=',
        onSave: '&',
        onDelete: '&'
      },
      link: function (scope, element, attrs) {

        scope.allStepsVisibleState = true;

        scope.toggleInstructionCollapsed = function () {
          scope.allStepsVisibleState = !scope.allStepsVisibleState;
          scope.$broadcast('instruction:toggleVisible', scope.allStepsVisibleState)
        };

        scope.instructionOptions = Object.keys(InstructionOptions);

        //sortable options

        scope.handleDelete = function () {
          if (scope.allowDelete) {
            scope.onDelete();
          }

          else if (!scope.deleteClickedOnce) {
            scope.deleteClickedOnce = true;
            $timeout(function () {
              scope.allowDelete = true;
            }, 500);
            $timeout(function () {
              scope.deleteClickedOnce = false;
              scope.allowDelete = false;
            }, 3000);
          }
        };

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

            //firebase will reset values if children all empty
            //note - this changes the reference...
            scope.protocol = angular.extend({
              refs : {},
              instructions: []
            }, scope.protocol);

          },
          stop: function (e, ui) {
            var type = ui.item.sortable.model,
              dropIndex = ui.item.sortable.dropindex;

            //hack - probably a better way. ng-include trying to get empty template unless has ng-if
            scope.$apply(function () {
              //need to replace here so that ng-model + ui-sortable stay in sync
              scope.protocol.instructions[dropIndex] = InstructionOptions[type].scaffold;
            });
          }
        };

        scope.onFileDrop = function (files, event, rejected) {
          if ($window.FileReader) {

            var fileReader = new FileReader();

            fileReader.onload = function(e) {
              scope.$apply(function() {
                try {
                  scope.protocol = angular.fromJson(e.target.result);
                  scope.meta = {
                    name : files[0].name
                  }
                } catch (e) {
                  console.log('couldnt parse dropped JSON', e);
                }
              });
            };

            fileReader.readAsText(files[0]);
          }
        };

        //todo - optimize (not run frequently but still)
        scope.$watchCollection('protocol.refs', function (newval, oldval) {
          if (newval != oldval) {
            var newkeys = _.keys(newval),
                oldkeys = _.keys(oldval);
            if (newkeys.length && (newkeys.length == oldkeys.length)) {
              var newkey = _.difference(newkeys, oldkeys)[0];
              var oldkey = _.difference(oldkeys, newkeys)[0];
              console.log('key change!', oldkey, newkey, oldkeys, newkeys);
              scope.$broadcast('protocol:refKeyChange', oldkey, newkey)
            }
          }
        });
      }
    };
  });
