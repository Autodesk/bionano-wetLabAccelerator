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
 * todo - add viewbox
 * todo - remove selection of disabled wells (add class if no data)
 *
 * Through combination of attributes no-brush and select-persist, you can specify whether one/many wells can be selected, and whether multiple groups can be selected
 */
angular.module('tx.datavis')
  .directive('txPlate', function (ContainerOptions, WellConv) {

    var classActive      = 'brushActive',
        classSelected    = 'brushSelected',
        classFocused     = 'wellFocused',
        classEmphasizing = 'wellEmphasized';

    var colors = {
      empty   : {
        r: 255, g: 255, b: 255, a: 1
      },
      disabled: {
        r: 0, g: 0, b: 0, a: 0.1
      },
      data    : {
        r: 150, g: 150, b: 200, a: 1
      }
    };

    var rgbaify = function (color, opacity) {
      return 'rgba(' + [color.r, color.g, color.b, (_.isUndefined(opacity) ? color.a : opacity)].join(',') + ')';
    };

    return {
      restrict: 'E',
      scope   : {
        container    : '=',  //shortname (key of ContainerOptions),
        plateData    : '=',  //data as defined above
        noBrush      : '=',  //boolean - prevent brush for selection, use clicks instead
        selectPersist: '=',  //boolean - allow selections to persist across one brush / click
        onHover      : '&',  //returns array of selected wells
        onSelect     : '&',  //returns array of selected wells
        selectedWells: '=?', //out-binding for selected wells. use wellsInput for changes in. todo - deprecate
        wellsInput   : '=?', //in-binding for selected wells. use selectedWells for changes out.
        groupData    : '=?', //array of groups with fields name, wells (alphanums), color (as string). if omitted, default to plateData, and preferGroups is ignored.
        preferGroups : '=?', //if both plateData and groups are defined, true gives group coloring priority
        focusWells   : '=?', //focus wells by shrinking others,
        noLabels     : '=?'
      },
      link    : function postLink (scope, element, attrs) {

        /* WATCHERS */

        scope.$watch('noLabels', function (hiding) {
          element.toggleClass('no-labels', !!hiding);
        });

        scope.$watch('container', _.partial(rerender, true));
        scope.$watch('plateData', _.partial(rerender, false));
        scope.$watch('groupData', _.partial(rerender, false));

        scope.$watch('wellsInput', function (newWells, oldWells) {
          if (_.isArray(newWells)) {
            safeClearBrush();
            toggleWellsFromMap(createWellMap(newWells, true), classSelected, true);
            propagateWellSelection(newWells);
          }
        });

        //todo - performance boost this
        scope.$watch('focusWells', function (newval) {
          if (!_.isUndefined(newval) && _.isArray(newval) && newval.length) {
            var map = createWellMap(newval, true);
            /*
            getAllCircles().attr('r', function (d, i) {
              return ( (d3.select(this).property('r_init') ) / (_.has(map, d) ? 1 : 2));
            });
            */
            getAllCircles().classed(classFocused, _.partial(_.has, map));
          } else {
            transitionData(getAllCircles());
          }
        });

        function propagateWellSelection (wellsInput) {
          var wells = _.isUndefined(wellsInput) ? getSelectedWells() : wellsInput;

          scope.$applyAsync(function () {
            scope.selectedWells = wells;
            scope.onSelect({$wells: wells});
          });
        }

        /* CONSTRUCTING THE SVG */

        var full   = {height: 425, width: 600},
            margin = {top: 30, right: 30, bottom: 30, left: 30},
            width  = full.width - margin.left - margin.right,
            height = full.height - margin.top - margin.bottom;

        //container SVG
        var svg = d3.select(element[0]).append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", "0 0 " + full.width + " " + full.height)
          .attr("preserveAspectRatio", "xMinYMin meet");

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

        var footerWrap = svg.append('svg:foreignObject')
              .attr({
                transform: 'translate(0,' + (full.height - margin.bottom) + ')',
                height   : margin.bottom,
                width    : full.width
              }),
            footerEl   = footerWrap.append("xhtml:div")
              .classed('plate-footer', true)
              .style({
                'width' : full.width + 'px',
                'height': margin.bottom + 'px'
              });

        footerEl.append('span').text('reset').on('click', clearWellsAndSelection);


        //data selection shared between multiple functions
        var wells = getAllCircles();

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

          var wellCount          = container.well_count,
              colCount           = container.col_count,
              rowCount           = wellCount / colCount,
              wellSpacing        = 2,
              wellRadius         = ( width - (colCount * wellSpacing) ) / colCount / 2,
              wellArray          = WellConv.createArrayGivenBounds([0, 1], [rowCount - 1, colCount]),
              transitionDuration = 200;

          if (shouldPlateUpdate) {
            xScale.domain(_.range(1, colCount + 1));
            yScale.domain(_.take(WellConv.letters, rowCount));

            xAxisEl.transition().duration(transitionDuration).call(xAxis);
            yAxisEl.transition().duration(transitionDuration).call(yAxis);

            //make axes clickable after data has been updated
          }

          wells = getAllCircles()
            .data(wellArray, function (well) { return well; })
            .call(unselectWells);

          if (shouldPlateUpdate) {
            wells.enter()
              .append('circle')
              .classed('well', true)
              .on('mouseenter', wellOnMouseover) //note that nothing will happen if brush is present
              .on('mouseleave', wellOnMouseleave)
              .on('click', wellOnClick)
              .style('fill', rgbaify(colors.data))
              .each(function (d, i) {
                d3.select(this).property('r_init', wellRadius);
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
            xAxisEl.selectAll('.tick').on('click', selectColumn);
            yAxisEl.selectAll('.tick').on('click', selectRow);

            wells.exit()
              .transition()
              .duration(transitionDuration)
              .style('opacity', 0)
              .remove();
          }

          safeClearBrush();
        }

        function transitionData (selection) {
          if (!selection || selection.empty()) return;

          //check conditions for showing groups, otherwise show data
          if (!_.isEmpty(scope.groupData) && ( scope.preferGroups || _.isEmpty(scope.plateData))) {
            //reorder to map so lookup is fast
            var groupMap = {};
            _.forEach(scope.groupData, function (group) {
              var color = group.color;
              _.forEach(group.wells, function (well) {
                groupMap[well] = color;
              });
            });

            changeWellColor(selection, groupMap, rgbaify(colors.disabled));
            scaleWellRadius(selection, {}, 1);
          } else if (!_.isEmpty(scope.plateData)) {
            //for changing radius of well
            scaleWellRadius(selection, _.mapValues(scope.plateData, 'value'), 0);

            /*//for changing fill of well
            selection.style('fill', function (d) {
              if (scope.plateData[d]) {
                return rgbaify(colors.data, scope.plateData[d].value);
              } else {
                return rgbaify(colors.disabled);
              }
            });*/
          }
        }

        /**** well hover + tooltip ****/

        var tooltipDimensions = {
          height: 20,
          width : 80
        },
            tooltipEl         = svg.append('svg:foreignObject')
              .classed('wellTooltip hidden', true)
              .attr(tooltipDimensions),
            tooltipInner      = tooltipEl.append("xhtml:div");

        function wellOnMouseover (d) {
          if (scope.noBrush) {
            //Get this well's values
            var d3El      = d3.select(this),
                radius    = parseFloat(d3El.attr("r"), 10),
                xPosition = parseFloat(d3El.attr("cx"), 10) - ( tooltipDimensions.width / 2 ) + margin.left,
                yPosition = parseFloat(d3El.attr("cy"), 10) - ( radius + tooltipDimensions.height ) + margin.top,
                wellValue = _.isEmpty(scope.plateData) || _.isUndefined(scope.plateData[d]) ?
                  null :
                  (+(scope.plateData[d].value)).toFixed(2);

            //Update the tooltip position and value
            tooltipEl.attr({
              x: xPosition,
              y: yPosition
            });

            tooltipInner.text(d + (wellValue ? ' : ' + wellValue : ''));
            tooltipEl.classed("hidden", false);
          }
        }

        function wellOnMouseleave () {
          //hide the tooltip
          tooltipEl.classed("hidden", true);
        }

        /****** Well clicking ******/

        //should be mutually exclusive to brush - events won't go down anyway
        function wellOnClick () {

          if (scope.noBrush) {

            var $el         = d3.select(this),
                wasSelected = $el.classed(classSelected);

            if (!scope.selectPersist) {
              toggleWellsFromMap({}, classSelected, true);
            }

            $el.classed(classSelected, !wasSelected);

            propagateWellSelection();
          }
        }

        function clearWellsAndSelection () {
          safeClearBrush();
          toggleWellsFromMap({}, classSelected, true);
          propagateWellSelection();
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

        var brushIsDrawn = false;       //helper for new brush / drag old brush todo - what should this actually track?

        function brushstart () {

          //if had brush, but clicked outside it
          if (brushIsDrawn && brush.empty()) {
            brushIsDrawn = false;
          }

          if (!scope.selectPersist) {
            toggleWellsFromMap({}, classSelected, true);
          }

          element.addClass('brushing');
        }

        //Triggered on clicks, moving brush, or clicking outside
        function brushmove () {

          var map = getWellsInExtent(brush.extent());

          //todo - ideally this would only run on a real move, not every cycle
          brushIsDrawn = !brush.empty() && (_.keys(map)).length > 0;

          toggleWellsFromMap(map, classActive, true);

          scope.$applyAsync(function () {
            scope.onHover({$wells: _.keys(map)});
          });
        }

        //get the selection, and propagate / save it
        function brushend () {

          var selected,
              initiallySelected = getSelectedWells();

          //note - may want to handle clicking outside active brush without selecting, current allow new brush
          //if brush is empty, e.g. they clicked
          if (brush.empty()) {
            selected     = getActiveWells();
            brushIsDrawn = false;
          }
          //if we have a brush (i.e. wells are selected)
          else if (brushIsDrawn) {
            selected = getActiveWells();
          }
          else {
            console.log('weirdness is happening');
          }

          var map     = createWellMap(selected, true),
              toggled = WellConv.toggleWells(map, initiallySelected);

          toggleWellsFromMap(toggled, classSelected);

          propagateWellSelection();

          element.removeClass('brushing');
        }

        /**** helpers ****/

        function scaleWellRadius (selection, valueMap, defaultRadius) {
          //todo - need to bound not to 0-1
          defaultRadius = _.isNumber(defaultRadius) ? defaultRadius : 1;
          var initRadius;
          return selection.attr('r', function (d) {
            if (_.isUndefined(initRadius)) {
              initRadius = d3.select(this).property('r_init');
            }
            return _.result(valueMap, d, defaultRadius) * initRadius;
          })
        }

        function changeWellColor (selection, valueMap, defaultColor) {
          selection.style('fill', function (d) {
            return _.result(valueMap, d, defaultColor);
          });
        }

        function selectColumn (col) {
          var rows      = yScale.domain().length - 1,
              parsedCol = parseInt(col, 10),
              wellMap   = WellConv.createMapGivenBounds([0, parsedCol], [rows, parsedCol]);

          toggleWellsFromMap(wellMap, classSelected, true);
          propagateWellSelection(_.keys(wellMap));
        }

        function selectRow (row) {
          var cols      = _.last(xScale.domain()),
              parsedRow = _.indexOf(WellConv.letters, row),
              wellMap   = WellConv.createMapGivenBounds([parsedRow, 0], [parsedRow, cols]);

          toggleWellsFromMap(wellMap, classSelected, true);
          propagateWellSelection(_.keys(wellMap));
        }

        //given array of wells, and a value, create hashmap with wells as keys
        function createWellMap (wells, value) {
          if (!_.isArray(wells)) {
            return {};
          }
          return _.zipObject(wells, _.range(wells.length).map(_.constant(value)));
        }

        function getWellsInExtent (extent) {
          var d           = xScale.domain(),
              r           = xScale.range(),
              //note - need to X correct for whatever reason
              topLeft     = [d[d3.bisect(r, extent[0][1]) - 1] - 1, d[d3.bisect(r, extent[0][0]) - 1]],
              bottomRight = [d[d3.bisect(r, extent[1][1]) - 1] - 1, d[d3.bisect(r, extent[1][0]) - 1]];

          return WellConv.createMapGivenBounds(topLeft, bottomRight);
        }

        function toggleWellsFromMap (map, className, toggleAll) {
          var selection = svg.selectAll("circle");
          className     = _.isUndefined(className) ? classSelected : className;

          if (!toggleAll) {
            selection = selection.filter(_.partial(_.has, map));
          }

          selection.classed(className, _.partial(_.result, map, _, false));
        }

        function getAllCircles () {
          return wellsSvg.selectAll('circle');
        }

        function getActiveWells () {
          return svg.selectAll('.' + classActive).data();
        }

        function getSelectedWells () {
          return svg.selectAll('.' + classSelected).data();
        }

        function inactivateWells (selection) {
          return selection.classed(classActive, false);
        }

        function unselectWells (selection) {
          return selection.classed(classSelected, false);
        }

        function safeClearBrush () {
          if (!_.isEmpty(brush) && _.isFunction(brush.clear)) {
            //clear the brush and update the DOM
            brushg.call(brush.clear());
            //trigger event to propagate data flow that it has been emptied
            //brushend();
          }
          toggleWellsFromMap({}, classActive, true);
        }
      }
    };
  });
