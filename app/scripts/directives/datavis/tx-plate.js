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
  .directive('txPlate', function ($timeout, ContainerOptions, WellConv) {

    var classActive      = 'brushActive',
        classSelected    = 'brushSelected',
        classFocused     = 'wellFocused',
        classEmphasizing = 'wellEmphasized';

    var colors = {
      empty   : {
        r: 240, g: 240, b: 240, a: 1
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
        container: '=',  //shortname (key of ContainerOptions). REQUIRED (or empty plate shown)

        //data

        plateData   : '=?',  //data as defined above
        extentData  : '=?', //override the extent of the data, e.g. for calculating well radius, in form [min , max]
        groupData   : '=?', //array of groups with fields name, wells (alphanums) array or 'all', color (as string). if omitted, default to plateData, and preferGroups is ignored. Can be single object
        preferGroups: '=?', //if both plateData and groups are defined, true gives group coloring priority

        //interation

        noSelect     : '=?', //prevent selection of wells
        noBrush      : '=?',  //boolean - prevent brush for selection, use clicks instead
        selectPersist: '=?',  //boolean - allow selections to persist across one brush / click

        //bindings

        onHover : '&?',  //returns array of selected wells
        onSelect: '&?',  //returns array of selected wells
        onReset : '&?',

        wellsInput    : '=?', //in-binding for selected wells. use onSelect() for changes out. Note that when using just groupData, this isn't necessary and might interfere with the model.
        transposeInput: '=?', //in-binding for transpose position
        focusWells    : '=?', //focus wells by shrinking others

        // UI

        showTranspose: '=?', //transpose arrow and toggle in footer should be present
        hideTooltip  : '=?', //hide tooltips for well hovering (brushing will prevent tooltip)
        noLabels     : '=?'  //hide labels on plate
      },
      link    : function postLink (scope, element, attrs) {

        //todo - more robust, make sure this is everywhere needed
        var internalSelectedWells = [];

        /* WATCHERS */

        scope.$watch('noLabels', function (hiding) {
          element.toggleClass('no-labels', !!hiding);
        });

        scope.$watch('noSelect', function (hiding) {
          element.toggleClass('no-select', !!hiding);
        });

        scope.$watch('noBrush', function (hiding) {
          element.toggleClass('no-brush', !!hiding);
        });

        scope.$watch('container', _.partial(rerender, true));
        scope.$watchGroup(['plateData', 'extentData'] , _.partial(rerender, false));
        scope.$watch('groupData', _.partial(rerender, false), true);

        //these are grouped because need to timeout for wellsInput, but transposeInput will propagate empty selection if runs before wellsInput
        scope.$watchGroup(['wellsInput', 'transposeInput'], function (newStuff) {
          var newWells        = newStuff[0],
              newTrans        = newStuff[1],
              shouldPropagate = false;

          if (_.isNumber(newTrans) && newTrans != transposePosition) {
            shouldPropagate   = true;
            transposePosition = newTrans;
          }

          //prevent infinite looping
          if (_.isArray(newWells) && !_.isEqual(newWells, internalSelectedWells)) {
            shouldPropagate = true;
          } else {
            newWells = internalSelectedWells;
          }

          if (shouldPropagate) {
            //timeout to ensure that well circles are drawn
            $timeout(function () {
              safeClearBrush();
              toggleWellsFromMap(createWellMap(newWells, true), classSelected, true);
              propagateWellSelection(newWells);
            });
          }

          refreshTransposeArrow(false);
        });

        //will compete with wellsInput
        scope.$watch('transposeInput', function (newTrans) {
          if (_.isNumber(newTrans) && newTrans != transposePosition) {
            setAndPropagateTranspose(newTrans);
          }
        });

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

        function propagateWellSelection (wellsInput, dontSort) {
          var wells = (_.isNull(wellsInput) || _.isUndefined(wellsInput)) ? getSelectedWells() : wellsInput;

          internalSelectedWells = !!dontSort ? wells : orderWellsWithTranspose(wells);

          scope.$applyAsync(function () {
            scope.onSelect({$wells: internalSelectedWells, $transpose: transposePosition});
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
          .attr("preserveAspectRatio", "xMidYMid meet");

        svg.classed('plate', true);

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

        var transposeButton = footerEl.append('span').text('transpose');
        var resetButton     = footerEl.append('span').text('reset').on('click', resetButtonClick);

        if (scope.showTranspose) {
          transposeButton.on('click', setAndPropagateTranspose);
        } else {
          transposeButton.classed('hidden', true);
        }


        //data selection shared between multiple functions
        var wells = getAllCircles();

        /* HANDLERS */

        //need to use shouldPlateUpdate flag instead of another function to accomodate transitions properly
        function rerender (shouldPlateUpdate) {
          element.toggleClass('plate-empty', !scope.container);

          if (!scope.container) {
            return;
          }

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
              wellRadiusCalc     = ( width - (colCount * wellSpacing) ) / colCount / 2,
              wellRadius         = (wellRadiusCalc > height / 2) ? (height / 2) : wellRadiusCalc,
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
              .style('fill', rgbaify(colors.data));

            //update all wells with new initial radius
            wells.each(function (d, i) {
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
                return (wellCount == 1) ? (width / 2) : (Math.floor(i % colCount) * ( (wellRadius * 2) + wellSpacing ) + wellRadius);
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

          //console.log(scope.groupData);

          //check conditions for showing groups, otherwise show data
          if (!_.isEmpty(scope.groupData) && ( scope.preferGroups || _.isEmpty(scope.plateData))) {
            //reorder to map so lookup is fast
            var groupMap  = {},
                groupData = _.has(scope.groupData, 'wells') ? [scope.groupData] : scope.groupData;

            _.forEach(groupData, function (group) {
              var color = _.result(group, 'color', rgbaify(colors.data));
              if (group.wells == 'all') {
                groupMap = _.constant(color);
                return false; //exit - this takes precedence
              } else {
                _.forEach(group.wells, function (well) {
                  groupMap[well] = color;
                });
              }
            });

            changeWellColor(selection, groupMap, rgbaify(colors.disabled));
            scaleWellRadius(selection, {}, 1);
          } else if (!_.isEmpty(scope.plateData)) {
            //for changing radius of well
            var mapped     = _.mapValues(scope.plateData, 'value'),
                extent     = (_.isArray(scope.extentData) && scope.extentData.length == 2) ?
                  scope.extentData :
                  d3.extent(_.values(mapped)),
                normalizer = d3.scale.linear().domain(extent).range([0, 1]).nice(),
                normalized = _.mapValues(mapped, normalizer);

            scaleWellRadius(selection, normalized, 0);

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
            tooltipEl         = d3.select(element[0]).append('div'),
            /*
            .style({
              width : tooltipDimensions.width + 'px',
              height: tooltipDimensions.height + 'px'
            }),
             */
            tooltipInner      = tooltipEl.append("xhtml:span");

        tooltipEl.classed('wellTooltip hidden', true);

        function wellOnMouseover (d) {
          if (!scope.hideTooltip) {
            //Get this well's values
            var d3El      = d3.select(this),
                radius    = parseFloat(d3El.attr("r"), 10),
                wellValue = _.isEmpty(scope.plateData) || _.isUndefined(scope.plateData[d]) ?
                  null :
                  (+(scope.plateData[d].value)).toFixed(2);

            /*
            //to position the tooltip statically above the well (won't scale for viewbox if tooltip appended outside svg)
            var xPosition = parseFloat(d3El.attr("cx"), 10) - ( tooltipDimensions.width / 2 ) + margin.left,
                yPosition = parseFloat(d3El.attr("cy"), 10) - ( radius + tooltipDimensions.height ) + margin.top,
            //Update the tooltip position and value
            tooltipEl.style({
              left: xPosition + 'px',
              top : yPosition + 'px'
            });
            */

            tooltipInner.text(d + (wellValue ? ' : ' + wellValue : ''));
            tooltipEl.classed("hidden", false);

            tooltipPositionListener();
            d3.select(element[0]).on('mousemove', tooltipPositionListener);
          }
        }

        function wellOnMouseleave () {
          //hide the tooltip
          !brushIsDrawn && tooltipEl.classed("hidden", true);
          if (!scope.hideTooltip) {
            d3.select(element[0]).on('mousemove', null);
          }
        }

        var tooltipPositionListener = function () {
          var pos = d3.mouse(element[0]);
          tooltipEl.style({
            left: (pos[0] + 4) + 'px',
            top : (pos[1] + 15) + 'px'
          });
        };

        /****** Well clicking ******/

        //should be mutually exclusive to brush - events won't go down anyway
        function wellOnClick () {

          if (scope.noBrush && !scope.noSelect) {

            var $el         = d3.select(this),
                wasSelected = $el.classed(classSelected);

            if (!scope.selectPersist) {
              toggleWellsFromMap({}, classSelected, true);
            }

            $el.classed(classSelected, !wasSelected);

            propagateWellSelection();
          }
        }

        function resetButtonClick () {
          safeClearBrush();
          toggleWellsFromMap({}, classSelected, true);
          propagateWellSelection();
          hideTransposeArrow();
          scope.$applyAsync(function () {
            scope.onReset();
          })
        }

        /***** BRUSHING *****/
            // note that b/c pointer events, this competes with hovering etc. so we put it on top

        var transposePosition   = 0,
            transposeArrowWidth = 12,
            transposeArrow      = svg.append('g')
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
              .append('path')
              .attr('d', function (d) {
                //append the arrow, by default in the top-left
                //translate to move it around
                return 'M ' + (-transposeArrowWidth) + ' ' + (-transposeArrowWidth * 0.75) + ' l ' +
                  transposeArrowWidth + ' ' + (transposeArrowWidth * 0.75) + ' ' + ' l ' +
                  (-transposeArrowWidth) + ' ' + (transposeArrowWidth * 0.75) + ' z';
              })
              .classed('hidden', true);

        var brush = d3.svg.brush()
          .x(xScale)
          .y(yScale)
          .on("brushstart", brushstart)
          .on("brush", brushmove)
          .on("brushend", brushend);

        var brushg = svg.append("g")
          .classed('brush', true)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        brushg.call(brush);


        var brushIsDrawn = false;       //helper for new brush / drag old brush

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

          //note - ideally this would only run on a real move, not every cycle, but not how d3 handles this
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

          refreshTransposeArrow(false);

          propagateWellSelection();

          element.removeClass('brushing');
          tooltipEl.classed("hidden", true);
        }

        function setAndPropagateTranspose (forceTranspose) {
          transposePosition = _.isUndefined(forceTranspose) ? ( (transposePosition + 1) % 8 ) : forceTranspose;
          transposeBrush();
          propagateWellSelection();
        }

        function refreshTransposeArrow (reset) {
          if (scope.showTranspose) {
            if (!!reset) {
              transposePosition = 0;
            }
            transposeArrow.classed('hidden', false);
            transposeButton.classed('disabled', false);
            transposeBrush();
          }
        }

        /*
          positions in numbers, wells as dots...

            1     2
          0 • • • • 3
            • • • •
          7 • • • • 4
            6     5
         */
        function transposeBrush () {
          var wells      = getSelectedWells();
          if (_.isEmpty(wells)) {
            transposeArrow.classed('hidden', true);
            return;
          }

          transposeArrow.classed('hidden', false);
          var wellBounds = getWellExtent(wells);

          transposeArrow.attr('transform', function () {
            var rotation   = (Math.floor((transposePosition + 1) / 2) * 90),
                firstPos   = getPositionWell(wellBounds[0]),
                lastPos    = getPositionWell(wellBounds[1]),
                wellRadius = firstPos[2],
                x_init     = _.includes([2, 3, 4, 5], transposePosition) ? lastPos[0] : firstPos[0],
                x_adjust   = _.result({
                  0: -wellRadius,
                  1: 0,
                  2: 0,
                  3: wellRadius,
                  4: wellRadius,
                  5: 0,
                  6: 0,
                  7: -wellRadius
                }, transposePosition, 0),
                x_trans    = x_init + x_adjust,
                y_init     = _.includes([0, 1, 2, 3], transposePosition) ? firstPos[1] : lastPos[1],
                y_adjust   = _.result({
                  0: 0,
                  1: -wellRadius,
                  2: -wellRadius,
                  3: 0,
                  4: 0,
                  5: wellRadius,
                  6: wellRadius,
                  7: 0
                }, transposePosition, 0),
                y_trans    = y_init + y_adjust;
            return 'translate(' + x_trans + ' ' + y_trans + ') rotate(' + rotation + ')';
          });
        }

        /*
       How these get sorted: + is ascending, < shows precedence

          L | N
        0 + > +
        1 + < +
        2 + < -
        3 + > -
        4 - > -
        5 - < -
        6 - < +
        7 - > +
         */
        function orderWellsWithTranspose (wells, transpose) {
          wells = _.isUndefined(wells) ? getSelectedWells() : wells;

          if (!scope.showTranspose && !transpose) {
            return wells;
          }

          transpose = _.isUndefined(transpose) ? transposePosition : transpose;

          var sortAscending = {
                row   : _.includes([0, 1, 2, 3], transpose),
                column: _.includes([0, 1, 6, 7], transpose)
              },
              priority      = _.includes([0, 3, 4, 7], transpose) ? 'row' : 'column',
              sortValues    = (priority == 'row') ? ['row', 'column'] : ['column', 'row'],
              sortAscents   = _.map(sortValues, function (field) {
                return _.result(sortAscending, field);
              }),
              sorted        = _(wells)
                .map(function (alphanum) {
                  return {
                    row   : alphanum.charAt(0),
                    column: parseInt(alphanum.substr(1), 10)
                  }
                })
                .sortByOrder(sortValues, sortAscents)
                .map(function (alphaObj) {
                  return alphaObj.row + alphaObj.column;
                })
                .value();

          return sorted;
        }

        /**** helpers ****/

        function scaleWellRadius (selection, valueMap, defaultRadius) {
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
          var func = _.isFunction(valueMap) ? valueMap : _.partial(_.result, valueMap, _, defaultColor);
          selection.style('fill', func);
        }

        function selectColumn (col) {
          if (scope.noSelect) return;
          var rows      = yScale.domain().length - 1,
              parsedCol = parseInt(col, 10),
              wellMap   = WellConv.createMapGivenBounds([0, parsedCol], [rows, parsedCol]);

          toggleWellsFromMap(wellMap, classSelected, true);
          propagateWellSelection(_.keys(wellMap));
        }

        function selectRow (row) {
          if (scope.noSelect) return;
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

        //todo - move to WellConv
        //given array of wells, gives topleft and bottom right wells as tuple (array)
        function getWellExtent (wells) {
          var letters = [],
              numbers = [];

          _.forEach(wells, function (well) {
            letters.push(well[0]);
            numbers.push(_.parseInt(well.substr(1)));
          });

          return _.map(_.zip(
            d3.extent(letters),
            d3.extent(numbers)
          ), function (tuple) {
            return tuple[0] + tuple[1];
          });
        }

        //for a given d3 extent, get well map of all contained wells
        function getWellsInExtent (extent) {
          var d           = xScale.domain(),
              r           = xScale.range(),
              //note - need to X correct for whatever reason
              topLeft     = [d[d3.bisect(r, extent[0][1]) - 1] - 1, d[d3.bisect(r, extent[0][0]) - 1]],
              bottomRight = [d[d3.bisect(r, extent[1][1]) - 1] - 1, d[d3.bisect(r, extent[1][0]) - 1]];

          return WellConv.createMapGivenBounds(topLeft, bottomRight);
        }

        function getPositionWell (well) {
          var filterFunction = _.partial(_.isEqual, well, _);
          var wellEl         = getAllCircles().filter(filterFunction);

          return [
            parseFloat(wellEl.attr('cx'), 10),
            parseFloat(wellEl.attr('cy'), 10),
            parseFloat(wellEl.property('r_init'), 10)
          ];
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
          if (!_.isEmpty(brush) && _.isFunction(brush.clear) && _.isFunction(brushg.call)) {
            //clear the brush and update the DOM
            brushg.call(brush.clear());
            //trigger event to propagate data flow that it has been emptied
            //brushend();
          }
          toggleWellsFromMap({}, classActive, true);
        }

        function hideTransposeArrow () {
          transposeArrow.classed('hidden', true);
        }
      }
    }
  });
