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

        scope.allVisible = true;

        scope.toggleInstructionCollapsed = function () {
          scope.allVisible = !scope.allVisible;
          scope.$broadcast('instruction:toggleVisible', scope.allVisible)
        };

        //might make sense to abstract this into directive if use elsewhere e.g. for data
        scope.downloadJson = function () {
          var a = document.createElement("a"),
              blob = new Blob([angular.toJson(scope.protocol, true)], {type: "application/json"});
              url = $window.URL.createObjectURL(blob);

          a.style = "display: none";
          a.href = url;
          a.download = 'protocol.json';

          element.append(a);
          a.click();

          $window.URL.revokeObjectURL(url);
          element[0].removeChild(a);
        };
      }
    };
  });
