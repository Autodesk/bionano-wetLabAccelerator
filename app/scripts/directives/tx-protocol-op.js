'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperation
 * @description
 * # txOperation
 */
angular.module('transcripticApp')
  .directive('txProtocolOp', function () {
    return {
      templateUrl: 'views/tx-protocol-op.html',
      restrict: 'E',
      scope: {
        op: '=protocolStep'
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
