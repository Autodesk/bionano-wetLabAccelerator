'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txPlate
 * @description
 * d3 plate graph
 *
 * Expects one timepoint, in form:
 * { <well> : {
 *    key : <well>,
 *    value : <value>
 *  }, ... }
 *
 */
angular.module('transcripticApp')
  .directive('txPlate', function (ContainerOptions, WellConv, $timeout) {

    return {
      restrict: 'E',
      scope: {
        container: '=', //shortname (key of ContainerOptions),
        plateData: '=',
        onHover: '&',   //returns array of selected wells
        onSelect: '&'   //returns array of selected wells
      },
      link: function postLink(scope, element, attrs) {

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
          width : 80
        };
        var tooltipEl = svg.append('svg:foreignObject')
          .classed('wellTooltip hidden', true)
          .attr(tooltipDimensions);
        var tooltipInner = tooltipEl.append("xhtml:div");

        //data selection shared between multiple functions
        var wells = wellsSvg.selectAll("circle");

        /* HANDLERS */

        //need to use shouldPlateUpdate flag instead of another function to accomodate transitions properly
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

          //deal here with all old items if you want, before the enter

          if (shouldPlateUpdate) {
            wells.enter()
              .append('circle')
              .classed('well', true)
              .on('mouseenter', wellOnMouseover)
              .on('mouseleave', wellOnMouseleave)
              .style('fill', 'rgba(255,255,255,0)')
              .each(function (d, i) {
                //todo - bind data beyond just well here
              });
          }

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

          if (shouldPlateUpdate) {
            wells.exit()
              .transition()
              .duration(transitionDuration)
              .style('opacity', 0)
              .remove()
          }
        }

        function transitionData (selection) {
          if (!scope.plateData || !selection || selection.empty()) return;
           selection.style('fill', function (d) {
            return 'rgba(150,150,200,' + scope.plateData[d].value + ')';
          });
        }

        /* well hover behaviors */

        function wellOnMouseover (d) {
          //Get this well's values
          var d3El = d3.select(this),
              radius = parseFloat(d3El.attr("r"), 10),
              xPosition = parseFloat(d3El.attr("cx"), 10) - ( tooltipDimensions.width / 2 ) + margin.left,
              yPosition = parseFloat(d3El.attr("cy"), 10) - ( radius + tooltipDimensions.height ) + margin.top,
              wellValue = _.isEmpty(scope.plateData) || _.isUndefined(scope.plateData[d]) ?
                null :
                +scope.plateData[d].value.toFixed(2);

          //Update the tooltip position and value
          tooltipEl.attr({
              x : xPosition,
              y : yPosition
            });

          tooltipInner.text(d + (wellValue ? ' : ' + wellValue : '') );
          tooltipEl.classed("hidden", false);
        }

        function wellOnMouseleave () {
          //hide the tooltip
          tooltipEl.classed("hidden", true);
        }

        //BRUSHING
        // note that b/c pointer events, this competes with hovering etc. so we put it on top

        var brush = d3.svg.brush()
          .x(xScale)
          .y(yScale)
          .on("brushstart", brushstart)
          .on("brush", brushmove)
          .on("brushend", brushend);

        var brushg = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        brushg.call(brush);

        function brushstart(p) {}

        // Highlight the selected circles.
        function brushmove(p) {

          var map = getSelectedWells(brush.extent());

          svg.selectAll("circle")
            .classed("brushSelected", _.partial(_.has, map) );

          scope.$apply(function () {
            scope.onHover({ $wells: _.keys(map) });
          });

          // deprecated
          // svg.selectAll("circle").classed("brushSelected", _.partial(elementInBounds, brush.extent()));
        }

        //get the selection, and propagate / save it
        function brushend() {

          var selected = svg.selectAll(".brushSelected").data();

          scope.$apply(function () {
            scope.onSelect({ $wells: selected });
          });

          //todo - toggle the active state of each well if in that mode

          //todo - special handling of click (i.e. brush.empty() == true)
        }

        function getSelectedWells (extent) {
          var d = xScale.domain(),
              r = xScale.range(),
              //note - need to X correct for whatever reason
              topLeft     = [ d[d3.bisect(r, extent[0][1]) - 1] - 1, d[d3.bisect(r, extent[0][0]) - 1] ],
              bottomRight = [ d[d3.bisect(r, extent[1][1]) - 1] - 1, d[d3.bisect(r, extent[1][0]) - 1] ];

          return WellConv.createMapGivenBounds(topLeft, bottomRight);
        }

        //DEPRECATED --- well center must be entirely in selection
        function elementInBounds (bounds, data) {
          var d3el = d3.select(this);

          return bounds[0][0] < parseInt(d3el.attr('cx'), 10) &&
            bounds[1][0] > parseInt(d3el.attr('cx'), 10) &&
            bounds[0][1] < parseInt(d3el.attr('cy'), 10) &&
            bounds[1][1] > parseInt(d3el.attr('cy'), 10);
        }
      }
    };
  });
