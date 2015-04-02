'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txWellplate
 * @description
 * # txWellplate
 */
//todo - might make sense to move canvas or something
// todo - handle clicking element outside well
angular.module('tx.datavis')
  .directive('txWellplate', function () {

    var letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

    function colRowToAlphanumeric (row, col) {
      return letters[row] + '' + col;
    }

    return {
      templateUrl: 'views/tx-wellplate.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        multiple: '=',
        containerReference: '=',
        hovered: '=?',
        selected: '=ngModel',
        onWellHover: '&',
        onWellSelect: '&'
      },
      link: function postLink(scope, element, attrs, ngModelCtrl) {
        scope.alphanumericWell = colRowToAlphanumeric;

        var selectedWells = {},
            initMousedown = null;

        scope.selectWells = function (alphanums) {
          angular.forEach(alphanums, function (alphanum) {
            selectedWells[alphanum] = !selectedWells[alphanum];
          });

          var actuallySelected = getSelectedWellsArray();

          scope.onWellSelect({$wells : actuallySelected});
          scope.selected = actuallySelected;
        };

        scope.isSelected = function (alphanum) {
          return !!selectedWells[alphanum];
        };

        scope.$watchCollection('selected', arrayToMap);

        scope.handleHover = function (alphanum) {
          scope.hovered = alphanum;
          scope.onWellHover({$well : alphanum})
        };

        //utils

        //get only the truthy wells
        function getSelectedWellsArray () {
          return _.keys(_.pick(selectedWells, _.identity));
        }

        function arrayToMap (array) {
          selectedWells = {};
          _.forEach(array, function (alphanum) {
            selectedWells[alphanum] = true;
          });
        }

        //given start and end, figure all wells between
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

        // handling drag selections

        function onMousedown (e) {
          initMousedown = angular.element(e.target).scope().alphaNum;
          e.preventDefault();
        }

        function onMouseup (e) {
          var finalMousedown = angular.element(e.target).scope().alphaNum;

          if (finalMousedown == initMousedown || !finalMousedown) {
            scope.$apply(function () {
              initMousedown && scope.selectWells([initMousedown]);
            });
          } else {
            scope.$apply(function () {
              (initMousedown && finalMousedown) && scope.selectWells(findSetSelected(initMousedown, finalMousedown));
            });
          }

          initMousedown = null;
          e.preventDefault();
        }

        function onMouseleave (e) {
          scope.$apply(function () {
            scope.hovered = null;
          });
        }

        element.on('mousedown', onMousedown);
        element.on('mouseup', onMouseup);
        element.on('mouseleave', onMouseleave);

        scope.$on('$destroy', function () {
          element.off('mousedown', onMousedown);
          element.off('mouseup', onMouseup);
          element.off('mouseleave', onMouseup);
        })
      }
    };
  });
