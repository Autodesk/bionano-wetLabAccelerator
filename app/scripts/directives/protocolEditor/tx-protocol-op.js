'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperation
 * @description
 * # txOperation
 *
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolOp', function ($rootScope, DragDropManager) {
    return {
      templateUrl: 'views/tx-protocol-op.html',
      restrict: 'E',
      require: '^txProtocolGroup',
      scope: {
        op: '=protocolStep'
      },
      bindToController: true,
      controllerAs: 'opCtrl',
      controller: function ($scope, $element, $attrs) {
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

        //note - called by protocol-editor
        $scope.receiveVerification = function (ver) {
          console.log(ver);
          _.assign(self, {verification : ver});
        };

      },
      link: function (scope, element, attrs, groupCtrl) {

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

        scope.$on('editor:verificationSuccess', function (e, val) {
          delete scope.opCtrl.verification;
        });
      }
    };
  });
