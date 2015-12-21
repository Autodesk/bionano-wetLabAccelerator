/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:contenteditable
 * @description
 * # contenteditable
 * //todo - support a placeholder value as lighter text
 */
angular.module('wetLabAccelerator').directive('contenteditable', function() {
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
        //don't want to set to nothing just because model didn't propagate
        if (angular.isUndefined(lastVal) && !text) {
          lastVal = "&nbsp;";
          return;
        }
        (lastVal !== text) && ngModel.$setViewValue(text);
        lastVal = text;
      }
    }
  };
});
