'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txMixbefore
 * @description
 * # txMixbefore
 */
angular.module('transcripticApp')
  .directive('txMixwrap', function () {
    return {
      templateUrl: 'views/tx-mixwrap.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        model: '=ngModel'
      }
    };
  });
