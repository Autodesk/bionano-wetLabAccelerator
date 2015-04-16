'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txDownloadjson
 * @description
 * # txDownloadjson
 */
//fixme - giving maximum callstack error ??
angular.module('transcripticApp')
  .directive('txDownloadjson', function ($window) {
    return {
      restrict: 'A',
      scope: {
        filename: '@',
        downloadModel: '=',
        downloadEvent: '@'
      },
      link: function postLink(scope, element, attrs) {
        element.on(scope.downloadEvent || 'click', function (e) {
          var a = document.createElement("a"),
            blob = new Blob([angular.toJson(scope.downloadModel, true)], {type: "application/json"}),
            url = $window.URL.createObjectURL(blob);

          a.style = "display: none";
          a.href = url;
          a.download = scope.filename || 'saved_json.json';

          element.append(a);
          a.click();

          $window.URL.revokeObjectURL(url);
          element[0].removeChild(a);

          e.preventDefault();
        });
      }
    };
  });
