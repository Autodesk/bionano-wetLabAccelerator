'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txBoolean
 * @description
 * # txBoolean
 */
angular.module('wetLabAccelerator')
  .directive('txBoolean', function () {
    return {
      templateUrl: 'views/tx-boolean.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        internalValue: '=ngModel',
        label: '@'
      }
    };
  });
