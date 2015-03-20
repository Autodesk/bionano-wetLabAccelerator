'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperationgroup
 * @description
 * # txOperationgroup
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolGroup', function () {
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

        self.opSortOptions = {
          handle: '.operation-name',
          containment: 'parent'
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
