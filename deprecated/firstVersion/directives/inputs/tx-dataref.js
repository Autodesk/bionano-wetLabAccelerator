'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txDataref
 * @description
 * # txDataref
 */
angular.module('transcripticApp')
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
