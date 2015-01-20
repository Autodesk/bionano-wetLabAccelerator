'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txWellplate
 * @description
 * # txWellplate
 */
//todo - support multiple T/F
angular.module('transcripticApp')
  .directive('txWellplate', function () {

    function colRowToAlphanumeric (row, col) {
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      return letters[row] + '' + col;
    }

    return {
      templateUrl: 'views/tx-wellplate.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        containerReference: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.alphanumericWell = colRowToAlphanumeric;

        scope.selectWell = function (alphanum) {
          var ind = scope.model.indexOf(alphanum);
          if (ind >= 0) {
            scope.model.splice(ind, 1);
          } else {
            if (scope.multiple || scope.model.length <= 1) {
              scope.model.push(alphanum);
            }
          }
        };

        //todo - perf -- move to map?
        scope.isSelected = function (alphanum) {
          return scope.model.indexOf(alphanum) >= 0;
        };
      }
    };
  });
