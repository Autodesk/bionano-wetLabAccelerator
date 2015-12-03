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
 * @name wetLabAccelerator.directive:popoverTransclude
 * @description
 * # popoverTransclude
 */
angular.module('wetLabAccelerator')
  .directive('popoverTransclude', function ($document, $timeout, $position) {
    return {
      restrict   : 'A',
      replace    : true,
      transclude : true,
      scope      : {
        title : '@',
        preferred: '@preferredPlacement',
        isOpen: '=?'
      },
      templateUrl: 'views/popover-transclude.html',
      link       : function (scope, element, attrs) {

        //future - make so can change
        var target = element.parent();

        scope.$close = function () {
          scope.isOpen = false;
        };

        scope.$on('$locationChangeSuccess', function popoverCloseOnLocation () {
          if (scope.isOpen) {
            scope.$close();
          }
          removePopover();
        });

        scope.$watch('isOpen', function (open, wasOpen) {
          hide();
          if (open) {
            positionPopover(target);
            $timeout(function () {
              //account for model changing or something by timing out and manually showing
              positionPopover(target);
              registerTriggers();
              show();
            });
          } else {
            //'open' class will be handled in template by internalOpen
            unregisterTriggers();
          }
        });

        // Make sure tooltip is destroyed and removed.
        scope.$on('$destroy', function onDestroyTooltip () {
          unregisterTriggers();
          removePopover();
        });

        //this relies on the popover being in the page... could add transforms to the popover and position before (e.g. for top translate -50%, 100%)
        function positionPopover (targetEl) {

          var preferred = _.includes(['top', 'bottom'], scope.preferred) ? scope.preferred : 'top';

          scope.placement = 'top';

          var pos         = $position.positionElements(targetEl, element, 'top', true),
              arrowHeight = 12;

          pos.top -= arrowHeight;

          var elementHeight = _.parseInt(element.css('height'), 10);

          //put on bottom if not room (and update styles)
          if (preferred == 'bottom' || elementHeight < 0 || pos.top < 0) {
            scope.placement = 'bottom';
            pos             = $position.positionElements(targetEl, element, scope.placement, true);
            pos.top += arrowHeight;
          }

          pos.top += 'px';
          pos.left += 'px';

          // Now set the calculated positioning.
          element.css(pos);
        }

        function hide () {
          element.css({
            opacity: 0
          });
        }

        function show () {
          element.css({
            opacity: 1
          });
        }

        function outsideClickListener ($event) {
          if (element[0].contains($event.target)) {
            //don't do anything....
          } else {
            scope.$apply(scope.$close);
          }
        }

        function registerTriggers () {
          $document.on('click', outsideClickListener);
        }

        function unregisterTriggers () {
          $document.off('click', outsideClickListener);
        }

        function removePopover () {
          element.remove();
        }

        //init
        $document.find('body').append(element);
      }
    };
  });
