'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txWell
 * @description
 * # txWell
 */
//todo - support for multiple attribute
angular.module('transcripticApp')
  .directive('txWell', function () {
    return {
      templateUrl: 'views/tx-well.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        internalValue: '=ngModel',
        container: '=',
        label: '@',
        multiple: '@'
      },
      link: function postLink(scope, element, attrs, ngModel) {
      }
    };
  });
