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
      templateUrl     : 'views/tx-protocol-group.html',
      restrict        : 'E',
      require         : '^txProtocolEditor',
      scope           : {
        group: '=protocolGroup'
      },
      bindToController: true,
      controllerAs    : 'groupCtrl',
      controller      : function ($scope, $element, $attrs) {
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
          $scope.logVisible  = false;
        };

        self.toggleLogCollapsed = function (force) {
          $scope.logVisible  = angular.isDefined(force) ?
            force :
            !( $scope.logVisible );
          $scope.jsonEditing = false;
        };

        self.duplicateStep = function (step) {
          var index = _.indexOf(self.group, step);
          self.group.steps.splice(index, 0, angular.copy(step));
        };

        self.deleteStep = function (step) {
          _.remove(self.group.steps, step);
        };

        //drag and drop interaction

        self.optsDraggableInstruction = {
          handle: '.operation-name',
          revert: true,
          start : function (e, ui) {
            var opScope = angular.element(e.target).scope(),
                opModel = opScope.step,
                opClone = _.cloneDeep(opModel);

            _.assign(DragDropManager, {
              type : 'operation',
              model: opClone,
              onDrop: function () {
                self.deleteStep(opModel);

                if (self.group.steps.length == 0) {
                  $scope.deleteGroup();
                }
              }
            });
          }
        };

        //these are internal so that position is calculated relative to group, not editor, better model binding

        self.optsDraggableGroup = {
          handle        : '.protocol-group-header',
          axis          : 'y',
          revert        : true,
          revertDuration: 0,
          start         : function (e, ui) {
            var groupModel = self.group,
                groupClone = _.cloneDeep(groupModel);

            _.assign(DragDropManager, {
              type : 'group',
              model: groupClone,
              onDrop: function () {
                $scope.deleteGroup();
              }
            });
          }
        };

        self.optsDroppableGroup = {
          tolerance: 'pointer',
          greedy   : true,
          drop     : function (e, ui) {
            var draggableTop = e.pageY,
                neighborTops = DragDropManager.getNeighborTops('tx-protocol-op', $element),
                dropIndex    = (_.takeWhile(neighborTops, function (neighborTop) {
                  return neighborTop < draggableTop;
                })).length;

            console.log('group', draggableTop, neighborTops, dropIndex, DragDropManager.type, DragDropManager.model);

            $scope.$apply(function () {
              DragDropManager.onDrop();

              if (DragDropManager.type == 'operation') {
                self.group.steps.splice(dropIndex, 0, DragDropManager.model);
              } else {
                _.forEach(DragDropManager.model.steps, function (step) {
                  self.group.steps.push(step);
                });
              }

              DragDropManager.clear();
            });
          }
        };

        self.optsDroppableInstruction = {
          greedy: true, //just a dummy to prevent propagation upward
          drop  : DragDropManager.clear //todo - better revert - or allow dropping afterward
        };

      },
      //editorCtrl only exposed in link
      link            : function (scope, element, attrs, editorCtrl) {
        scope.duplicateGroup = function () {
          editorCtrl.duplicateGroup(scope.groupCtrl.group);
        };

        scope.deleteGroup = function () {
          editorCtrl.deleteGroup(scope.groupCtrl.group);
        };
      }
    };
  });
