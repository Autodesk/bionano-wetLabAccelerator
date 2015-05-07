'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txColumnVolumes
 * @description
 * # txColumnVolumes
 *
 * todo - decide if it makes sense to really just use the plate instead...
 * //todo - refactor this to being 1-indexed
 */
angular.module('transcripticApp')
  .directive('txPlateColumns', function (ContainerOptions) {

    var rgbaify = function (color, opacity) {
      return 'rgba(' + [color.r, color.g, color.b, (_.isUndefined(opacity) ? color.a : opacity)].join(',') + ')';
    };

    var colors = {
      'default' : { r: 0, g: 0, b: 0, a: 0.1}
    };

    return {
      restrict: 'E',
      scope: {
        groupData: '=',
        containerType : '=?',
        onClick: '&'          //passed column index (0-indexed)
      },
      link: function postLink(scope, element, attrs) {

        scope.$watch('groupData', render, true);
        scope.$watch('containerType', handleContainerType);


        /* CONSTRUCTING THE SVG */

        var full   = {height: 100, width: 600},
            margin = {top: 30, right: 15, bottom: 15, left: 15},
            width  = full.width - margin.left - margin.right,
            height = full.height - margin.top - margin.bottom;

        //container SVG
        var svg = d3.select(element[0]).append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", "0 0 " + full.width + " " + full.height)
          .attr("preserveAspectRatio", "xMidYMid meet");

        scope.$watch(function () {
          return element[0].offsetWidth;
        }, function (newWidth) {
          element.attr('height', (newWidth / full.width) * full.height);
        });

        var wellsSvg = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //scales
        var xScale = d3.scale
          .ordinal()
          .rangeBands([0, width]);

        //axes
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("top");

        //axes elements
        var xAxisEl = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //data selection shared between multiple functions
        var wells = getAllCircles();



        function render () {
          var colCount = scope.numberColumns || 24,
              columns = _.range(colCount),
              wellSpacing        = 2,
              wellRadiusCalc     = ( width - (colCount * wellSpacing) ) / colCount / 2,
              wellRadius         = (wellRadiusCalc > height / 2) ? (height/2) : wellRadiusCalc,
              transitionDuration = 200;

          wells = getAllCircles()
            .data(columns);

          //todo - handle x-axis element

          wells.enter()
            .append('circle')
            .classed('well', true)
            .on('click', wellOnClick)
            .style('fill', rgbaify(colors.default));

          wells.transition()
            .duration(transitionDuration)
            .attr({
              "cx": function (d, i) {
                return (colCount == 1) ? (width / 2) : (Math.floor(i % colCount) * ( (wellRadius * 2) + wellSpacing ) + wellRadius);
              },
              "cy": function (d, i) {
                return Math.floor(i / colCount) * ( (wellRadius * 2) + wellSpacing ) + wellRadius
              },
              "r" : wellRadius
            })
            .call(transitionData);

          wells.exit()
            .transition()
            .duration(transitionDuration)
            .style('opacity', 0)
            .remove();

        }

        function handleContainerType (newtype, oldtype) {
          var cont = _.result(ContainerOptions, newtype),
              columnNumber = _.result(cont, 'col_count', 24);

          if (scope.numberColumns != columnNumber) {
            scope.numberColumns = columnNumber;
            render();
          }
        }


        function transitionData (selection) {
          if (!selection || selection.empty()) return;

          var colMap = {};
          _.forEach(scope.groupData, function (colvol) {
            _.forEach(colvol.columns, function (col) {
              colMap[col] = colvol.color;
            })
          });

          colorWells(colMap);
        }

        function wellOnClick (d) {
          var el = d3.select(this);
          scope.$apply(function () {
            scope.onClick({$column : d})
          });
        }

        //helpers

        function colorWells (colMap) {
          getAllCircles().style('fill', _.partial(_.result, colMap, _, rgbaify(colors.default)))
        }

        function getAllCircles () {
          return wellsSvg.selectAll('circle');
        }

        function getColumnsInGroup (group) {
          return group.columns;
        }
      }
    };
  });
