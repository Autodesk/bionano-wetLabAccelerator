'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolDraggable
 * @description
 * # txProtocolDraggable
 */
angular.module('transcripticApp')
  .directive('txProtocolDraggable', function ($parse, DragDropManager) {
    return {
      restrict: 'A',
      link    : function postLink (scope, element, attrs) {

        var dragDefaults = {
              scroll  : true
            },
            parsedRaw    = $parse(attrs['txProtocolDraggable'])(scope),
            parsed       = _.isObject(parsedRaw) ? parsedRaw : {},
            merged       = _.assign(dragDefaults, parsed);

        element.draggable(merged);
      }
    };
  });
