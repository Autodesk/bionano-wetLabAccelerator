'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txWell
 * @description
 * # txWell
 */
angular.module('transcripticApp')
  .directive('txWell', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the txWell directive');
      }
    };
  });
