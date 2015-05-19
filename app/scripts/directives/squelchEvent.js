'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:eventStopPropagation
 * @description
 * # eventStopPropagation
 */
angular.module('transcripticApp')
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
