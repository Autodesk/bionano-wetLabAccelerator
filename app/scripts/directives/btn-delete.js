'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:btnDelete
 * @description
 * # btnDelete
 */
angular.module('transcripticApp')
  .directive('btnDelete', function ($timeout) {
    return {
      template: '<button class="btn btn-default btn-sm" \
                        ng-class="{\'btn-danger\' : deleteClickedOnce}" \
                        ng-click="handleDelete()" \
                        tooltip="{{deleteClickedOnce ? \
                                    (allowDelete ? \'Click again to Delete\' : \'Wait...\') : \
                                    (deleteText ? deleteText : \'Delete\') }}" \
                        tooltip-append-to-body="true"> \
                   <span class="glyphicon glyphicon-minus"></span> \
                 </button>',
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
