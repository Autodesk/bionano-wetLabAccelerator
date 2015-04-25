'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperationgroup
 * @description
 * # txOperationgroup
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolGroup', function (DragDropManager) {
    return {
      templateUrl: 'views/tx-protocol-group.html',
      restrict: 'E',
      require: '^txProtocolEditor',
      scope: {
        group: '=protocolGroup'
      },
      bindToController: true,
      controllerAs: 'groupCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        self.toggleGroupActionsVisible = function ($event, force) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.groupActionsVisible = angular.isDefined(force) ?
            force :
            !( $scope.groupActionsVisible );
        };

        //footer actions
        self.toggleJsonEditing = function (force) {
          $scope.jsonEditing = angular.isDefined(force) ?
            force :
            !( $scope.jsonEditing );
          $scope.logVisible = false;
        };

        self.toggleLogCollapsed = function (force) {
          $scope.logVisible = angular.isDefined(force) ?
            force :
            !( $scope.logVisible );
          $scope.jsonEditing = false;
        };

        //drag and drop interaction

        self.optsDraggableInstruction = {
          handle: '.operation-name',
          revert: true,
          start: function (e, ui) {
            var opScope = angular.element(e.target).scope(),
                opModel = opScope.step;

            _.assign(DragDropManager, {
              type : 'operation',
              model : opModel
            });
          }
        };

        //these are internal so that position is calculated relative to group, not editor

        self.optsDraggableGroup = {
          handle: '.protocol-group-header',
          axis: 'y',
          revert: true,
          revertDuration: 0,
          start: function (e, ui) {
            var opScope = angular.element(e.target).scope(),
                opModel = opScope.step;

            _.assign(DragDropManager, {
              type : 'group',
              model : opModel
            });
          }
        };

        self.optsDroppableGroup = {
          tolerance: 'pointer',
          greedy: true,
          drop: function (e, ui) {
            var draggableTop = ui.draggable.offset().top,
                neighborTops = DragDropManager.getNeighborTops('tx-protocol-op', $element),
                dropIndex = (_.takeWhile(neighborTops, function (neighborTop) {
                  return neighborTop < draggableTop;
                })).length;

            console.log('group', draggableTop, neighborTops, dropIndex, DragDropManager.type, DragDropManager.model);

             if (DragDropManager.type == 'operation') {
               $scope.$applyAsync(function () {
                 self.group.steps.splice(dropIndex, 0, DragDropManager.model);
               });
             } else {
               //todo - handle merging groups
             }

            //todo - handle deletion / splice of original model / DOM
          }
        };

        self.optsDroppableInstruction = {
          greedy: true, //just a dummy to prevent propagation upward
          drop: _.noop
        };

      },
      //editorCtrl only exposed in link
      link: function (scope, element, attrs, editorCtrl) {
        scope.duplicateGroup = function () {
          editorCtrl.duplicateGroup(scope.groupCtrl.group);
        };

        scope.deleteGroup = function () {
          editorCtrl.deleteGroup(scope.groupCtrl.group);
        };
      }
    };
  });
