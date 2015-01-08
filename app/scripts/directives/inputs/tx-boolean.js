'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txBoolean
 * @description
 * # txBoolean
 */
angular.module('transcripticApp')
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
