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
 * @name wetLabAccelerator.directive:txModal
 * @description
 * # txModal
 *
 * can use function scope.$close to close the modal, or you can add a function scope.$onClose() to run when closing the modal
 */
angular.module('wetLabAccelerator')
  .directive('txModal', function () {
    return {
      templateUrl: 'views/tx-modal.html',
      restrict   : 'E',
      scope      : {
        ngShow : '=',
        title  : '@?',
        onClose: '&?'
      },
      transclude : true,
      link       : function (scope, element, attrs, ctrl, transcludeFn) {

        scope.dialogStyle = {};
        if (attrs.top) {
          scope.dialogStyle.top = attrs.top;
        }
        if (attrs.height) {
          scope.dialogStyle.height = attrs.height;
        }

        scope.hideModal = function () {
          _.attempt(scope.onClose);
          scope.ngShow = false;

          transcludeFn(function (clone, transcludeScope) {
            _.attempt(transcludeScope.$onClose);
          });
        };

        //this is annoying because usually siblings, so can't emit, and have to use $rootScope.$broadcast...
        scope.$on('$modalClose', function (event) {
          if (scope.ngShow) {
            _.attempt(event.stopPropagation); //only exists on emitted events
            event.preventDefault();
            scope.hideModal();
          }
        });

        /*
        //todo - this causes double linking... for some reason, we dont need this and it just happens magically...
        //can't use ng-transclude and update the scope, so add the element manually
        transcludeFn(scope.$parent, function (clone, transcludeScope) {
          var transcludeEl       = element.find('modal-transclude');
          transcludeEl.empty();
          transcludeEl.append(clone);
          transcludeScope.$close = scope.hideModal;
        });
        */
      }
    };

  });
