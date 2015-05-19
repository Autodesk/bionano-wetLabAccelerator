'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:popoverTransclude
 * @description
 * # popoverTransclude
 */
angular.module('transcripticApp')
  .directive('popoverTransclude', function ($document, $position) {
    return {
      restrict   : 'A',
      replace    : true,
      transclude : true,
      scope      : {
        title: '@',
        isOpen: '='
      },
      templateUrl: 'views/popover-transclude.html',
      link       : function (scope, element, attrs) {

        //todo - put on bottom if not oom (update styles)

        //todo - make so can change
        var target = element.parent();

        //todo- attach click outside listener, escape listener

        $document.find('body').append(element);

        positionPopover(target);

        scope.$close = function () {
          scope.isOpen = false
        };

        scope.$on('$locationChangeSuccess', function closePopoverOnLocationChangeSuccess () {
          if (scope.isOpen) {
            scope.$close();
          }
        });

        // Make sure tooltip is destroyed and removed.
        scope.$on('$destroy', function onDestroyTooltip () {
          unregisterTriggers();
        });

        function positionPopover (targetEl) {
          //hack - expect top
          var ttPosition = $position.positionElements(targetEl, element, 'top', true);
          ttPosition.top = (ttPosition.top - 12) + 'px';
          ttPosition.left += 'px';

          // Now set the calculated positioning.
          element.css(ttPosition);
        }

        function unregisterTriggers () {

        }
      }
    };
  });
