'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperation
 * @description
 * # txOperation
 *
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolOp', function (DragDropManager) {
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

        self.toggleActionsMenu = function ($event, force) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.showActions = angular.isDefined(force) ?
            force :
            !( $scope.showActions );
        };

        self.toggleJsonEditing = function ($event, force) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.jsonEditing = angular.isDefined(force) ?
            force :
            !( $scope.jsonEditing );
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

        $scope.modalShown = false;
        self.toggleModal = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.modalShown = !$scope.modalShown;
        };

        //note - called by protocol-editor
        $scope.receiveVerification = function (ver) {
          console.log(ver);
          _.assign(self, {verification : ver});
        };

      },
      link: function (scope, element, attrs, groupCtrl) {

        scope.$watch('opCtrl.isVisible', function (viz) {
          element.toggleClass('open', !!viz);
        });

        scope.deleteStep = function () {
          groupCtrl.deleteStep(scope.opCtrl.op);
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
