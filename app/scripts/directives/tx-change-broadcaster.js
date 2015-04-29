'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txChangeBroadcaster
 * @description
 * # txChangeBroadcaster
 *
 * On a directive with ng-model, $broadcasts an event from $rootScope given as string to this attribute directive, passing the old value and the new value as parameters
 */
angular.module('transcripticApp')
  .directive('txChangeBroadcaster', function ($rootScope) {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function (input) {
          $rootScope.$broadcast(attrs.txChangeBroadcaster, ngModel.$modelValue, ngModel.$viewValue);
          return input;
        });
      }
    };
  });
