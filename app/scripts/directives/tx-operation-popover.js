'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txOperationPopover
 * @description
 * # txOperationPopover
 */
angular.module('wetLabAccelerator')
  .directive('txOperationPopover', function () {
    return {
      templateUrl: 'views/tx-operation-popover.html',
      restrict: 'E',
      scope: {
        op: '=operation'
      },
      bindToController: true,
      controllerAs: 'popCtrl',
      controller: function ($scope, $element, $attrs) {

      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
