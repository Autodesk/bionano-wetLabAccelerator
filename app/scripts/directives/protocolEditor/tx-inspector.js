'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txInspector
 * @description
 * # txInspector
 */
angular.module('tx.protocolEditor')
  .directive('txInspector', function () {
    return {
      templateUrl: 'views/tx-inspector.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
