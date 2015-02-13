'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txWelltip
 * @description
 * # txWelltip
 */
angular.module('transcripticApp')
  .directive('txWelltip', function () {
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the txWelltip directive');
      }
    };
  });
