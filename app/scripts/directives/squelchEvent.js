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
 * @name wetLabAccelerator.directive:eventStopPropagation
 * @description
 * # eventStopPropagation
 */
angular.module('wetLabAccelerator')
  .directive('squelchEvent', function () {
    return {
      restrict: 'A',
      link    : function postLink (scope, element, attrs) {
        var oldEvent,
            listener = function ($event) {
              $event.preventDefault();
              $event.stopPropagation();
            };

        scope.$watch(function () {
          return attrs.squelchEvent;
        }, function (newEvent) {
          //unbind old
          oldEvent && element.off(oldEvent, listener);

          //set up new, and save type
          newEvent && element.on(newEvent, listener);
          oldEvent = newEvent;
        })
      }
    };
  });
