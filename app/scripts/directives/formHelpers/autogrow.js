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
 * @name wetLabAccelerator.directive:autogrow
 * @description
 * # autogrow
 */
angular.module('wetLabAccelerator')
  .directive('autoGrow', function($timeout) {
    return {
      require: '?ngModel',
      link: function(scope, element, attr, ngModelCtrl){
        var paddingLeft = element.css('paddingLeft'),
            paddingRight = element.css('paddingRight');

        var minWidth = parseInt(attr.autoGrow, 10) || parseInt(element.css('minWidth'), 10) || 50;

        var update = function() {
          var val = element.val()
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
            ;
          var calcWidth;

          // If empty calculate by placeholder
          if (val !== "") {
            calcWidth = val.length * 7 + 15;
          } else {
            calcWidth = element[0].placeholder.length * 7 + 10;
          }

          //extra to handle new letter before next $digest $shadow[0].offsetWidth
          var newWidth = Math.max(calcWidth, minWidth) + "px";
          if (val.length < 26) {
            element.css('width', newWidth);
          }
        };

        if (ngModelCtrl) {
          scope.$watch(function () {
            return ngModelCtrl.$viewValue;
          }, update)
        } else {
          element.bind('keyup keydown blur', update);
        }

        // Update on the first link
        // $timeout is needed because the value of element is updated only after the $digest cycle
        // TODO: Maybe on compile time if we call update we won't need $timeout
        $timeout(update);
      }
    }
  });
