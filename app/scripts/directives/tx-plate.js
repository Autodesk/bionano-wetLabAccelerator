'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txPlate
 * @description
 * d3 plate graph
 */
angular.module('transcripticApp')
  .directive('txPlate', function (ContainerOptions, WellConv, $timeout) {

    return {
      restrict: 'E',
      scope: {
        container: '=', //shortname (key of ContainerOptions),
        plateData: '='
      },
      link: function postLink(scope, element, attrs) {

        //map of wells, where truthy means selected, falsy / null not
        var selectedWells = {};

        /* WATCHERS */

        scope.$watch('container', _.partial(rerender, true));
        scope.$watch('plateData', _.partial(rerender, false));

        /* CONSTRUCTING THE SVG */

        var margin = {top: 40, right: 20, bottom: 20, left: 40},
            width = 600 - margin.left - margin.right,
            height = 420 - margin.top - margin.bottom;

        //container SVG
        var svg = d3.select(element[0]).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        var wellsSvg = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //scales
        var xScale = d3.scale
          .ordinal()
          .rangeBands([0, width]);

        var yScale = d3.scale
          .ordinal()
          .rangeBands([0, height]);

        //axes
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("top");

        var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

        //axes elements
        var xAxisEl = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var yAxisEl = svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        //tooltip

        var tooltipDimensions = {
          height: 20,
          width : 30
        };
        var tooltipEl = svg.append('svg:foreignObject')
          .classed('wellTooltip hidden', true)
          .attr(tooltipDimensions);
        var tooltipInner = tooltipEl.append("xhtml:div");

        //data selection shared between multiple functions
        var wells = wellsSvg.selectAll("circle");

        /* HANDLERS */

        function rerender (shouldPlateUpdate) {
          if (!scope.container) return;

            var container = ContainerOptions[scope.container],
                wellCount = container.well_count,
                colCount = container.col_count,
                rowCount = wellCount / colCount,
                wellSpacing = 2,
                wellRadius = ( width - (colCount * wellSpacing) ) / colCount / 2,
                wellArray = WellConv.createArrayGivenBounds([0,1], [rowCount - 1, colCount]),
                transitionDuration = 200;

          if (shouldPlateUpdate) {
            xScale.domain(_.range(1, colCount + 1));
            yScale.domain(_.take(WellConv.letters, rowCount));

            xAxisEl.transition().duration(transitionDuration).call(xAxis);
            yAxisEl.transition().duration(transitionDuration).call(yAxis);
          }

          wells = wellsSvg.selectAll("circle")
            .data(wellArray, function (well) { return well; } );

          wells.enter()
            .append('circle')
              .classed('well', true)
              .on('mouseenter', wellOnMouseover)
              .on('mouseleave', wellOnMouseleave)
              .style('fill', 'rgba(255,255,255,0)');

          //update
          wells
            .transition()
            .duration(transitionDuration)
              .attr({
                "cx": function (d, i) {
                  return Math.floor(i % colCount) * ( (wellRadius * 2) + wellSpacing ) + wellRadius
                },
                "cy": function (d, i) {
                  return Math.floor(i / colCount) * ( (wellRadius * 2) + wellSpacing ) + wellRadius
                },
                "r" : wellRadius
              })
              .call(transitionData); //externalize handling of data potentially being undefined

          wells.exit()
              .transition()
                .duration(transitionDuration)
                .style('opacity', 0)
              .remove()
        }

        function transitionData (selection) {
          if (!scope.plateData) return;
           selection.style('fill', function (d) {
            return 'rgba(150,150,200,' + scope.plateData[d] + ')';
          });
        }

        /* well hover behaviors */

        function wellOnMouseover (d) {
          //Get this weel's values
          var d3El = d3.select(this),
              radius = parseFloat(d3El.attr("r"), 10),
              xPosition = parseFloat(d3El.attr("cx"), 10) - ( tooltipDimensions.width / 2 ) + margin.left,
              yPosition = parseFloat(d3El.attr("cy"), 10) - ( radius + tooltipDimensions.height ) + margin.top;

          //Update the tooltip position and value
          tooltipEl.attr({
              x : xPosition,
              y : yPosition
            });
          tooltipInner.text(d);
          tooltipEl.classed("hidden", false);
        }

        function wellOnMouseleave () {
          //hide the tooltip
          tooltipEl.classed("hidden", true);
        }

        /*
        //BRUSHING

        var brush = d3.svg.brush()
          .x(x)
          .y(y)
          .on("brushstart", brushstart)
          .on("brush", brushmove)
          .on("brushend", brushend);

        var brushCell;

        // Clear the previously-active brush, if any.
        function brushstart(p) {
          if (brushCell !== this) {
            d3.select(brushCell).call(brush.clear());
            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
            brushCell = this;
          }
        }

        // Highlight the selected circles.
        function brushmove(p) {
          var e = brush.extent();
          console.log(e);
          svg.selectAll("circle").classed("hidden", function(d) {
            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
              || e[0][1] > d[p.y] || d[p.y] > e[1][1];
          });
        }

        // If the brush is empty, select all circles.
        function brushend() {
          if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
        }

        */
      }
    };
  });
