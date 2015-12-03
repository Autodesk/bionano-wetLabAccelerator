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
