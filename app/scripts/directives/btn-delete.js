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
 * @name wetLabAccelerator.directive:btnDelete
 * @description
 * # btnDelete
 */
angular.module('wetLabAccelerator')
  .directive('btnDelete', function ($timeout) {
    return {
      templateUrl: 'views/btnDelete.html',
      restrict: 'E',
      replace: true,
      scope: {
        deleteText: '@',
        onDelete : '&'
      },
      link: function postLink(scope, element, attrs) {

        scope.handleDelete = function () {
          if (scope.allowDelete) {
            scope.onDelete();
          }

          else if (!scope.deleteClickedOnce) {
            scope.deleteClickedOnce = true;
            $timeout(function () {
              scope.allowDelete = true;
            }, 500);
            $timeout(function () {
              scope.deleteClickedOnce = false;
              scope.allowDelete = false;
            }, 3000);
          }
        };

      }
    };
  });
