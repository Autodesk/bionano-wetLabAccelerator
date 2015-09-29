'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txDataref
 * @description
 * # txDataref
 */
angular.module('wetLabAccelerator')
  .directive('txDataref', function () {
    return {
      templateUrl: 'views/tx-dataref.html',
      require: 'ngModel',
      restrict: 'E',
      scope: {
        internalValue: '=ngModel'
      }
    };
  });
