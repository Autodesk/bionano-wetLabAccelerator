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

        self.duplicateStep = function (step) {
          var index = _.indexOf(self.group, step);
          self.group.steps.splice(index, 0, angular.copy(step));
        };

        self.deleteStep = function (step) {
          _.remove(self.group.steps, step);
          if (self.group.steps.length == 0) {
            $scope.deleteGroup();
          }
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
              type  : 'operation',
              model : opClone,
              onDrop: function () {
                self.deleteStep(opModel);
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
              type  : 'group',
              model : groupClone,
              onDrop: function () {
                $scope.deleteGroup();
              }
            });
          }
        };

        self.optsDroppableGroup = {
          tolerance: 'pointer',
          greedy   : true,
          drop     : handleDrop
        };

        self.optsDroppableInstruction = self.optsDroppableGroup;

        function getOperationDropIndex (dropY) {
          var draggableTop = dropY,
              neighborTops = DragDropManager.getNeighborTops('tx-protocol-op', $element);

          return (_.takeWhile(neighborTops, function (neighborTop) {
            return neighborTop < draggableTop;
          })).length;
        }

        function handleDrop (e, ui) {
          var dropIndex    = getOperationDropIndex(e.pageY),
              indexInGroup = _.findIndex(self.group.steps, function (step) {
                //note - could speed if wasn't using clones...
                return _.isEqual(step, DragDropManager.model);
              });

          if (indexInGroup > -1) {
            $scope.$apply(function () {
              if (DragDropManager.type == 'operation') {
                if (indexInGroup < dropIndex) {
                  dropIndex--;
                }
                self.group.steps.splice(indexInGroup, 1);
                self.group.steps.splice(dropIndex, 0, DragDropManager.model);
              } else {
                _.forEach(DragDropManager.model.steps, function (step) {
                  self.group.steps.push(step);
                });
              }
            });
          }
          //otherwise allow dropping onto instruction as if group
          else {
            $scope.$apply(function () {
              DragDropManager.onDrop();

              if (DragDropManager.type == 'operation') {
                self.group.steps.splice(dropIndex, 0, DragDropManager.model);
              } else {
                _.forEach(DragDropManager.model.steps, function (step) {
                  self.group.steps.push(step);
                });
              }
            });
          }

          DragDropManager.clear();
        }

      },
      //editorCtrl only exposed in link
      link            : function (scope, element, attrs, editorCtrl) {
        scope.duplicateGroup = function () {
          editorCtrl.duplicateGroup(scope.groupCtrl.group);
        };

        scope.deleteGroup = function () {
          editorCtrl.deleteGroup(scope.groupCtrl.group);
        };

        scope.$on('editor:toggleGroupVisibility', function (e, val) {
          scope.groupCtrl.isCollapsed = !!val;
        });
      }
    };
  });
