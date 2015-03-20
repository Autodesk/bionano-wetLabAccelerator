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
 *
 * Through combination of attributes no-brush and select-persist, you can specify whether one/many wells can be selected,
 * and whether multiple groups can be selected
 *
 * todo - allow syncing of selected wells
 * todo - circle to clear whole selection (top-left)
 * todo - store selection in indexed array, show indices
 */
angular.module('tx.datavis')
  .directive('txPlate', function (ContainerOptions, WellConv) {

    return {
      restrict: 'E',
      scope: {
        container: '=', //shortname (key of ContainerOptions),
        plateData: '=',
        noBrush: '=', //boolean - prevent brush for selection, use clicks instead
        selectPersist: '=', //boolean - allow selections to persist across one brush / click
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

        //data selection shared between multiple functions
        var wells = wellsSvg.selectAll("circle");

        /* HANDLERS */

        //need to use shouldPlateUpdate flag instead of another function to accomodate transitions properly
        function rerender (shouldPlateUpdate) {
          if (!scope.container) return;

          var container = ContainerOptions[scope.container];

          if (_.isEmpty(container)) {
            //todo - better error handling
            console.warn('invalid container: ', scope.container);
            return;
          }

          var wellCount = container.well_count,
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
            .data(wellArray, function (well) { return well; } )
            .call(unselectWells);

          //deal here with all old items if you want, before the enter

          if (shouldPlateUpdate) {
            wells.enter()
              .append('circle')
              .classed('well', true)
              .on('mouseenter', wellOnMouseover)
              .on('mouseleave', wellOnMouseleave)
              .on('click', wellOnClick)
              .style('fill', 'rgba(255,255,255,0)')
              .each(function (d, i) {
                //could bind data beyond just well here... but what makes sense?
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

          clearBrush();
        }

        function transitionData (selection) {
          if (!scope.plateData || !selection || selection.empty()) return;

          selection.style('fill', function (d) {
            if (scope.plateData[d]) {
              return 'rgba(150,150,200,' + scope.plateData[d].value + ')';
            } else {
              return 'rgba(0,0,0,0.3)';
            }
          });
        }

        /**** well hover + tooltip ****/

        var tooltipDimensions = {
          height: 20,
          width : 80
        };
        var tooltipEl = svg.append('svg:foreignObject')
          .classed('wellTooltip hidden', true)
          .attr(tooltipDimensions);
        var tooltipInner = tooltipEl.append("xhtml:div");

        function wellOnMouseover (d) {
          //Get this well's values
          var d3El = d3.select(this),
              radius = parseFloat(d3El.attr("r"), 10),
              xPosition = parseFloat(d3El.attr("cx"), 10) - ( tooltipDimensions.width / 2 ) + margin.left,
              yPosition = parseFloat(d3El.attr("cy"), 10) - ( radius + tooltipDimensions.height ) + margin.top,
              wellValue = _.isEmpty(scope.plateData) || _.isUndefined(scope.plateData[d]) ?
                null :
                (+(scope.plateData[d].value)).toFixed(2);

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

        /****** Well clicking ******/

        //should be mutually exclusive to brush - events won't go down anyway
        function wellOnClick () {

          if (scope.noBrush) {

            var $el = d3.select(this),
                wasSelected = $el.classed('brushSelected');

            if (!scope.selectPersist) {
              svg.selectAll("circle").call(unselectWells);
            }

            $el.classed('brushSelected', !wasSelected);

            scope.$applyAsync(function () {
              scope.onSelect({ $wells: getSelectedWells() });
            });
          }
        }

        /***** BRUSHING *****/
        // note that b/c pointer events, this competes with hovering etc. so we put it on top

        if (!scope.noBrush) {
          var brush = d3.svg.brush()
            .x(xScale)
            .y(yScale)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

          var brushg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          brushg.call(brush);
        }

        //fixme - not behaving as expected
        // need to track both whole selection, and previous selection
        // on start, clear previous selection if moving brush
        // on move, if persisting, retain whole selection, minus previous, plus current brush

        var brushIsDrawn = false,      //whether brush region is freshly drawn (not moved)
            brushLastSelected = [];   //last selection of brush (click to kill brush excepted)

        function brushstart() {

          //if already have a brush
          if (brushIsDrawn) {
            //check for empty - clicked outside existing brush
            if (brush.empty()) {
              brushIsDrawn = false;
            }
            //otherwise, moving brush = remove last selection - new selection will be added in brushmove
            else {
              var map = createWellMap(brushLastSelected, false);
              toggleWellsFromMap(map, false);
            }
          }

          if (!scope.selectPersist) {
            svg.selectAll("circle").call(unselectWells);
          }
        }

        //Triggered on clicks, moving brush, or clicking outside
        function brushmove() {

          var map = getWellsInExtent(brush.extent());

          //get the outersection of selected wells, unless moving the brush
          if (!brushIsDrawn && scope.selectPersist) {
            map = WellConv.toggleWells(map, brushLastSelected);
          }

          if (brushIsDrawn) {

          } else {

          }

          //todo - fold already selected wells into map

          toggleWellsFromMap(map);

          scope.$applyAsync(function () {
            scope.onHover({ $wells: _.keys(map) });
          });
        }

        //get the selection, and propagate / save it
        function brushend() {

          var selected;

          //if have a brush and they clicked without dragging
          if (brushIsDrawn && brush.empty()) {
              brushIsDrawn = false;
              selected = [];

            if (!scope.selectPersist) {
              svg.selectAll("circle").call(unselectWells);
            }
          }
          //moved the brush
          else if (brushIsDrawn && !brush.empty()) {
            selected = getSelectedWells();
            brushIsDrawn = true;
          }
          //clicked a well
          else if (brush.empty() && !brushIsDrawn) {
            selected = getSelectedWells();
            brushIsDrawn = false;
          }
          //not empty, and no brush drawn (impossible)
          else {}

          console.log(brushIsDrawn, brush.empty(), selected.length, selected, brushLastSelected);

          scope.$applyAsync(function () {
            scope.onSelect({ $wells: selected });
          });

          brushLastSelected = selected;
        }

        /**** helpers ****/

        function createWellMap (wells, value) {
          return _.zipObject( brushLastSelected, _.range(wells.length).map(_.constant(value)) )
        }

        function getWellsInExtent (extent) {
          var d = xScale.domain(),
              r = xScale.range(),
              //note - need to X correct for whatever reason
              topLeft     = [ d[d3.bisect(r, extent[0][1]) - 1] - 1, d[d3.bisect(r, extent[0][0]) - 1] ],
              bottomRight = [ d[d3.bisect(r, extent[1][1]) - 1] - 1, d[d3.bisect(r, extent[1][0]) - 1] ];

          return WellConv.createMapGivenBounds(topLeft, bottomRight);
        }

        function toggleWellsFromMap (map, toggleAll) {
          var selection = svg.selectAll("circle");

          if (!toggleAll) {
            selection = selection.filter(_.partial(_.has, map));
          }

          selection.classed("brushSelected", _.partial(_.result, map, _, false) );
        }

        function getSelectedWells () {
          return svg.selectAll(".brushSelected").data();
        }

        function unselectWells (selection) {
          return selection.classed('brushSelected', false);
        }

        function clearBrush () {
          if (!_.isEmpty(brush) && _.isFunction(brush.clear) ) {
            //clear the brush and update the DOM
            brushg.call(brush.clear());
            //trigger event to propagate data flow that it has been emptied
            brushend();
          }
        }
      }
    };
  });
