'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txMixbefore
 * @description
 * # txMixbefore
 */
angular.module('wetLabAccelerator')
  .directive('txMixwrap', function () {
    return {
      templateUrl: 'views/tx-mixwrap.html',
      restrict: 'A', //fixme - temporarily disabling...
      require: 'ngModel',
      scope: {
        model: '=ngModel'
      }
    };
  });
