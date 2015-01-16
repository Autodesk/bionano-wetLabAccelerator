'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocol
 * @description
 * # txProtocol
 */

angular.module('transcripticApp')
  .directive('txProtocol', function ($window, $document) {
    return {
      templateUrl: 'views/tx-protocol.html',
      restrict: 'E',
      scope: {
        protocol: '='
      },
      link: function (scope, element, attrs) {
        scope.sortableOptions = {
          axis: 'y',
          handle: '.panel-heading',
          update: function (e, ui) {
            //see https://github.com/angular-ui/ui-sortable/blob/master/API.md#uiitemsortable-api-documentation
            console.log('update event!', ui);
          }
        };

        scope.allStepsVisibleState = true;

        scope.toggleInstructionCollapsed = function () {
          scope.allStepsVisibleState = !scope.allStepsVisibleState;
          scope.$broadcast('instruction:toggleVisible', scope.allStepsVisibleState)
        };


      }
    };
  });
