'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocol
 * @description
 * # txProtocol
 */
angular.module('transcripticApp')
  .directive('txProtocol', function () {
    return {
      templateUrl: 'views/tx-protocol.html',
      restrict: 'E',
      scope: {
        protocol: '='
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
