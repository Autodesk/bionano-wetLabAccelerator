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

    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    function colRowToAlphanumeric (row, col) {
      return letters[row] + '' + col;
    }

    return {
      templateUrl: 'views/tx-wellplate.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        multiple: '=',
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

        // handling drag selections
        // todo - handle clicking element outside well

        var initMousedown;

        function findSetSelected(start, end) {
          var rows = [letters.indexOf(start.charAt(0)), letters.indexOf(end.charAt(0))].sort();
          var cols = [start.substr(1), end.substr(1)].sort();
          var grid = [];
          for (var r = rows[0]; r <= rows[1]; r++) {
            for (var c = cols[0]; c <= cols[1]; c++) {
              grid.push(colRowToAlphanumeric(r, c));
            }
          }
          return grid;
        }

        function onMousedown (e) {
          initMousedown = angular.element(e.target).scope().alphaNum;
          e.preventDefault();
        }

        function onMouseup (e) {
          var finalMousedown = angular.element(e.target).scope().alphaNum;

          if (finalMousedown == initMousedown || !finalMousedown) {
            initMousedown && scope.selectWell(initMousedown);
          } else {
            scope.$apply(function () {
              (initMousedown && finalMousedown) && findSetSelected(initMousedown, finalMousedown).forEach(scope.selectWell)
            });
          }

          initMousedown = null;
        }

        element.on('mousedown', onMousedown);
        element.on('mouseup', onMouseup);

        scope.$on('$destroy', function () {
          element.off('mousedown', onMousedown);
          element.off('mouseup', onMouseup);
        })
      }
    };
  });
