'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperation
 * @description
 * # txOperation
 */
angular.module('transcripticApp')
  .directive('txOperation', function () {
    return {
      templateUrl: 'views/tx-operation.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
