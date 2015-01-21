'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:contenteditable
 * @description
 * # contenteditable
 */
angular.module('transcripticApp').directive('contenteditable', function() {
  return {
    restrict: 'A',
    require: '?ngModel' ,
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      var lastVal;

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.text(ngModel.$viewValue || '');
      };

      // Listen for change events to enable binding
      // Note that this obviously ignores ngModelOptions
      element.on('blur keyup change', function() {
        scope.$eval(read);
      });

      read(); // initialize

      // Write data to the model
      function read(forceVal) {
        var text = angular.isString(forceVal) ? forceVal : element.text();
        lastVal = text;
        (lastVal != text) && ngModel.$setViewValue(text);
      }
    }
  };
});
