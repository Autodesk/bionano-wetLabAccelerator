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
 * @name wetLabAccelerator.directive:resizeable
 * @description
 *
 *
 * @attr resizeDirection
 * @attr resizeProperty
 * @attr resizePosition
 *
 * Recommended you use a min/max-height/width for setting constraints
 * future - inspect min/max-height/width as constraints. Currently, because using width, browser won't pass them
 *
 * @example
 *
 <div style="min-width: 200px; width: 300px;" resizeable
 resize-property="width"
 resize-position="right"
 resize-direction="horizontal"></div>
 *
 */
angular.module('wetLabAccelerator')
  .directive('resizeable', function ($document) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        if (angular.isUndefined(attrs.resizeDirection) ||
            angular.isUndefined(attrs.resizePosition) ||
            angular.isUndefined(attrs.resizeProperty) ) {
          console.warn('resizeable directive missing attributes');
          return;
        }

        var isHorizontal = attrs.resizeDirection == 'horizontal';

        var handle = angular.element('<div>');
        element.append(handle);
        handle.addClass('resizeable-handle');
        var handleCss = {
          position: 'absolute',
          cursor: isHorizontal ? 'ew-resize' : 'ns-resize'
        };
        handleCss[attrs.resizePosition] = 0;
        handleCss[isHorizontal ? 'top' : 'left'] = '0px';
        handleCss[isHorizontal ? 'width' : 'height'] = '5px';
        handleCss[isHorizontal ? 'height' : 'width'] = '100%';

        element.css({
          position: 'relative',
          overflow: 'hidden'
        });
        handle.css(handleCss);

        var startPos,
            startProperty;

        handle.on('mousedown', handleMousedown);

        function handleMousedown (evt) {
          evt.preventDefault();
          handle.addClass('dragging');

          startProperty = parseInt(element.css(attrs.resizeProperty), 10);
          startPos = isHorizontal ? evt.pageX : evt.pageY;

          $document.on('mousemove', handleMousemove);
          $document.on('mouseup', handleMouseup);
        }

        function handleMousemove (evt) {
          evt.preventDefault();
          var curPos = isHorizontal ? evt.pageX : evt.pageY,
              delta  = startPos - curPos;

          //correct for directionality / increasing or decreasing
          delta *= (attrs.resizePosition == 'bottom' ||
                    attrs.resizePosition == 'right') ? -1 : 1;

          element.css(attrs.resizeProperty, startProperty + delta);
        }

        function handleMouseup (evt) {
          handle.removeClass('dragging');
          $document.off('mousemove', handleMousemove);
          $document.off('mouseup', handleMouseup);
        }
      }
    };
  });
