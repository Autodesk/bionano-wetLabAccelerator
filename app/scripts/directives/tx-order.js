'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOrder
 * @description
 * # txOrder
 */
angular.module('transcripticApp')
  .directive('txOrder', function () {
    return {
      templateUrl: 'views/tx-order.html',
      restrict: 'E',
      scope: {
        order: '=',
        orderType: '='
      }
    };
  });
