'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperation
 * @description
 * # txOperation
 *
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolOp', function ($rootScope, ProtocolUtils, DragDropManager) {
    return {
      templateUrl     : 'views/tx-protocol-op.html',
      restrict        : 'E',
      require         : '^txProtocolGroup',
      scope           : {
        op: '=protocolStep'
      },
      bindToController: true,
      controllerAs    : 'opCtrl',
      controller      : function ($scope, $element, $attrs) {
        var self = this;

        self.verifyProtocol = function () {
          $rootScope.$broadcast('editor:initiateVerification');
        };

        self.optsDroppableOpTop = {
          drop: function (e, ui) {
            $scope.$apply(function () {
              DragDropManager.onDrop();
              $scope.insertBeforeStep(DragDropManager.stepsFromModel());
              DragDropManager.clear();
            });
          }
        };

        //todo - functions below are same as in operationSummary (but with different op binding)... maybe make a factory and pass in op?

        //wells - pipette (mostly)

        self.getContainerFromAliquots = applyOpToFn(ProtocolUtils.getFirstContainerFromAliquots);

        self.getContainerTypeFromAliquots = applyOpToFn(ProtocolUtils.getContainerTypeFromAliquots);

        self.getContainerColorFromAliquots = applyOpToFn(ProtocolUtils.getContainerColorFromAliquots);

        //functions for fields with type container

        self.getContainerTypeFromFieldName = applyOpToFn(ProtocolUtils.getContainerTypeFromFieldName);

        self.getContainerColorFromFieldName = applyOpToFn(ProtocolUtils.getContainerColorFromFieldName);


        function applyOpToFn (utilFn) {
          return _.partial(utilFn, self.op);
        }
      },
      link            : function (scope, element, attrs, groupCtrl) {

        scope.groupCtrl = groupCtrl;

        scope.$watch('opCtrl.isVisible', function (viz) {
          element.toggleClass('open', !!viz);
        });

        element.on('mouseenter', function () {
          scope.opCtrl.isHovered = true;
        });

        element.on('mouseleave', function () {
          scope.opCtrl.isHovered = false;
        });

        scope.deleteStep = function () {
          groupCtrl.deleteStep(scope.opCtrl.op);
        };

        scope.duplicateStep = function () {
          groupCtrl.duplicateStep(scope.opCtrl.op);
        };

        scope.insertBeforeStep = function (newSteps) {
          groupCtrl.insertBeforeStep(scope.opCtrl.op, newSteps);
        };

        scope.$on('editor:toggleGroupVisibility', function (e, val) {
          scope.opCtrl.isVisible = !!val;
        });

        scope.$on('editor:clearVerifications', function (e, val) {
          delete scope.opCtrl.verification;
        });

        //note - called by protocol-editor
        scope.receiveVerification = function (ver) {
          //console.log(ver);
          _.assign(scope.opCtrl, {verification: ver});
        };
      }
    };
  });
