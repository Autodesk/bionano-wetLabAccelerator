'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txInspectorSelect
 * @description
 * # txInspectorSelect
 */
angular.module('wetLabAccelerator')
  .directive('txInspectorSelect', function ($parse, $rootScope) {

      var elements = [],
          lastSelected = -1,
          selectedClass = 'inspector-select';

      function registerElement (element) {
        return elements.push(element);
      }

      return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        function parseAttr (attr) {
          return $parse(attrs[attr])(scope);
        }

        var selectElementIndex = registerElement(element) - 1;

        element.on( (attrs['selectTrigger'] || 'click') , function () {
          if (lastSelected != selectElementIndex) {
            (lastSelected >= 0) && elements[lastSelected].removeClass(selectedClass);
            element.addClass(selectedClass);

            $rootScope.$broadcast('txInspector:update', {
              title : parseAttr('selectTitle'),
              type : parseAttr('selectType'),
              description : parseAttr('selectDescription')
            });

            lastSelected = selectElementIndex;
          }
        });
      }
    };
  });
