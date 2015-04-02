'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txInspector
 * @description
 * # txInspector
 */
angular.module('tx.protocolEditor')
  .directive('txInspector', function ($rootScope) {
    return {
      templateUrl: 'views/tx-inspector.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        $rootScope.$on('txInspector:update', function (event, info) {
          scope.$applyAsync(_.extend(scope, info));
        });
      }
    };
  });
