'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txInspector
 * @description
 * # txInspector
 */
angular.module('transcripticApp')
  .directive('txInspector', function () {
    return {
      templateUrl: 'views/tx-inspector.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
