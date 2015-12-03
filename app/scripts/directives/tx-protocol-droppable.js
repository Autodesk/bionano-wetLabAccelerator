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
 * @name wetLabAccelerator.directive:txProtocolDroppable
 * @description
 * # txProtocolDroppable
 */
angular.module('wetLabAccelerator')
  .directive('txProtocolDroppable', function ($parse, DragDropManager) {
    return {
      restrict: 'A',
      link    : function postLink (scope, element, attrs) {

        //note that many places in editor expect these defaults
        var dropDefaults = {
              greedy    : true,
              tolerance : 'pointer',
              hoverClass: 'drop-hover'
            },
            parsedRaw    = $parse(attrs['txProtocolDroppable'])(scope),
            parsed       = _.isObject(parsedRaw) ? parsedRaw : {},
            merged       = _.assign(dropDefaults, parsed);

        element.droppable(merged);
      }
    };
  });
