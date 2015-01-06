'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txContainer
 * @description
 * # txContainer
 */
angular.module('transcripticApp')
  .directive('txContainer', function (Containers) {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs, ngModel) {

      }
    };
  });
