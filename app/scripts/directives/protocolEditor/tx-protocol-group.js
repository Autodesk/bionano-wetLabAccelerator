'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txOperationgroup
 * @description
 * # txOperationgroup
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolGroup', function (DragDropManager, $rootScope) {
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

        self.verifyProtocol = function () {
          $rootScope.$broadcast('editor:initiateVerification');
        };

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

        self.insertBeforeStep = function (step, newSteps) {
          var index = _.indexOf(self.group, step);
          Array.prototype.splice.apply(self.group.steps, [index, 0].concat(newSteps));
        };

        //drag and drop interaction

        self.optsDraggableInstruction = {
          handle: '.operation-header',
          axis  : 'y',
          zIndex: 100000,
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
          zIndex: 100000,
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

        self.optsDroppableGroupTop = {
          drop: function (e, ui) {
            $scope.$apply(function () {
              DragDropManager.onDrop();
              $scope.insertBeforeGroup(DragDropManager.groupFromModel());
              DragDropManager.clear();
            });
          }
        };

        self.optsDroppableGroupHeader = {
          drop: function (e, ui) {
            handleDropGivenIndex(0);
          }
        };

        //todo - deprecate when possible (currently, rely on this for spacing between operations)
        self.optsDroppableGroup = {
          drop: handleDrop
        };

        self.optsDroppableInstruction = self.optsDroppableGroup;

        //helpers

        function getOperationDropIndex (dropY) {
          var draggableTop = dropY,
              neighborTops = DragDropManager.getNeighborTops('tx-protocol-op', $element);

          return (_.takeWhile(neighborTops, function (neighborTop) {
            return neighborTop < draggableTop;
          })).length;
        }

        function handleDrop (e, ui) {
          var dropIndex = getOperationDropIndex(e.pageY);
          handleDropGivenIndex(dropIndex);
        }

        function handleDropGivenIndex (dropIndex) {
          var indexInGroup = _.findIndex(self.group.steps, function (step) {
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

        scope.insertBeforeGroup = function (newGroup) {
          editorCtrl.insertBeforeGroup(scope.groupCtrl.group, newGroup);
        };
      }
    };
  });
