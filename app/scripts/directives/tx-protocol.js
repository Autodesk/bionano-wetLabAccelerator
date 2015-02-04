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

        scope.instructionSortableOptions = {
          axis: 'y',
          scroll: true,
          handle: '.drag-handle'
        };

        scope.newSortableOptions = {
          scroll: true,
          connectWith: ".instructionDropTarget",
          update: function (e, ui) {
            var type = ui.item.sortable.model,
              dropIndex = ui.item.sortable.dropindex;

            //if (1) dropped outside a defined list or (2) dropping into same list -> cancel it
            if (_.isUndefined(dropIndex) ||
                ui.item.sortable.source[0] == ui.item.sortable.droptarget[0]) {
              ui.item.sortable.cancel();
            } else {
              scope.protocol = angular.extend({
                refs : {},
                instructions: []
              }, scope.protocol);

              scope.$apply(function () {
                console.log('revising');
                //needs to be in the update so that object with inheritance set up, not a string
                scope.protocol.instructions[dropIndex] = InstructionOptions[type].scaffold;
                console.log(scope.protocol.instructions[dropIndex]);
                resetInstructionList();

                //todo - need to prevent default model updating (i.e. splicing another in)
                //alternatively, put this in the stop clause
                //todo - need a better track by
                ui.item.sortable.cancel();
              });
            }
          },
          stop: function (e, ui) {
/*            var type = ui.item.sortable.model,
              dropIndex = ui.item.sortable.dropindex;

            //if didn't drop onto the other list, nope out
            if (ui.item.sortable.isCanceled() || _.isUndefined(dropIndex)) return;

            //firebase will reset values if children all empty
            //note - this changes the reference...
            scope.$apply(function () {
              console.log('revising');
              scope.protocol.instructions[dropIndex] = InstructionOptions[type].scaffold;
              console.log(scope.protocol.instructions[dropIndex]);
              resetInstructionList();
            });

            $timeout(function () {
              console.log(scope.protocol.instructions[dropIndex]);
            }, 100)
*/
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

        function resetInstructionList () {
          scope.instructionOptions = Object.keys(InstructionOptions);
        }
      }
    };
  });
