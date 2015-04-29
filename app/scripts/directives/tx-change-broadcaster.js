'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txChangeBroadcaster
 * @description
 * # txChangeBroadcaster
 */
angular.module('transcripticApp')
  .directive('txChangeBroadcaster', function ($rootScope) {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (input) {
          $rootScope.$broadcast(attrs.txChangeBroadcaster, ngModel.$viewValue, ngModel.$modelValue);
          return input;
        });
      }
    };
  });
