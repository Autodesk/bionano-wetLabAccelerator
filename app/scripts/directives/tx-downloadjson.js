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
 * @name wetLabAccelerator.directive:txDownloadjson
 * @description
 * # txDownloadjson
 */
angular.module('wetLabAccelerator')
  .directive('txDownloadjson', function ($window, $document) {
    return {
      restrict: 'A',
      scope: {
        filename: '@',
        downloadModel: '=',
        downloadEvent: '@',
        downloadFormatter: '='
      },
      link: function postLink(scope, element, attrs) {
        element.on(scope.downloadEvent || 'click', function (e) {
          console.log('clicked', e.target);

          //only needed when appending to element, not body
          //handle clicking the a child, and prevent propagation + infinite loop
          if (e.target != element[0]) {
            e.stopPropagation();
            return;
          }

          var a = document.createElement("a"),
              formatter = _.isFunction(scope.downloadFormatter) ? scope.downloadFormatter : _.identity,
              formatted = formatter(scope.downloadModel),
              blob = new Blob([angular.toJson(formatted, true)], {type: "application/json"}),
              url = $window.URL.createObjectURL(blob);

          if (_.isEmpty(formatted)) {
            console.warn('file empty! not triggering download...');
            return;
          }

          a.style.display = "none";
          a.href = url;
          a.download = scope.filename || 'saved_json.json';

          $document[0].body.appendChild(a);

          setTimeout(function () {
            a.click();
            $window.URL.revokeObjectURL(url);
            $document[0].body.removeChild(a);
          }, 50);
        });
      }
    };
  });
