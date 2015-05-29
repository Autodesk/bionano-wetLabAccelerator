'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txTimepointgraph
 * @description
 * Expects data in form
 *
 * { <timepoint> : {
 *     <well> : {
 *       key : <well>,
 *       ordinal : <timepoint>,
 *       value : <value>
 *     },
  *    ...
 *   },
 *   ...
 * }
 *
 * And will dynamically figure out all keys and values.
 *
 * Timepoints may be ordinal or linear values (defaulting to ordinal), use attr isLinear to specify.
 * If the axis is linear, timevalue must be coercible to a Date
 *
 *
 //todo - need to handle key not being present for given ordinal - shouldn't display line? or just interpolate?

 // if makes sense, may want to extrapolate line selection filter out of this directive
 */
angular.module('tx.datavis')
  .directive('txTimepointgraph', function () {
    return {
      restrict: 'E',
      scope   : {
        data          : '=',
        graphMeta     : '=', //accepts xlabel, ylabel, title
        seriesSelected: '=',
        onHover       : '&',
        interpolation : '=?', //interpolation function to use (e.g. linear, default cardinal)
        isLinear      : '=',

        timepointSelected: '=?', //outward binding for current timepoint
        extentData       : '=?' //outward binding of extent of data (i.e. y axis domain)
      },
      link    : function postLink (scope, element, attrs) {

        scope.$watch('data', drawGraph);
        scope.$watch('graphMeta', updateMeta, true);

        scope.$watch('seriesSelected', handleSeriesSelection);

        /****
         Graph Construction
         ****/

        var full = {
          height: 380,
          width : 600
        };

        var chart = d3.select(element[0])
          .append('svg')
          .attr('id', 'chart')
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", "0 0 " + full.width + " " + full.height)
          .attr("preserveAspectRatio", "xMidYMid meet");

        var labelHeight = 15,
            margin      = {top: 15 + labelHeight, right: 15, bottom: 30 + labelHeight, left: 40 + labelHeight},
            width       = full.width - margin.left - margin.right,
            height      = full.height - margin.top - margin.bottom;

        var filter = chart.append('defs').append('filter')
          .attr('id', 'line-backdrop')
          .attr('width', '150%') //avoid clipping
          .attr('height', '150%'); //avoid clipping

        // SourceAlpha refers to opacity of graphic that this filter will be applied to
        // convolve that with a Gaussian with standard deviation 3 and store result
        // in blur
        filter.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 3)
          .attr("result", "blur");

        filter.append("feMorphology")
          .attr("operator", 'dilate')
          .attr("in", "SourceGraphic")
          .attr("radius", 1)
          .attr("result", "dilation");

        filter.append('feColorMatrix')
          .attr('type', 'matrix')
          .attr('values', '1 1 1 1   0 \
                           1 1 1 1   0 \
                           1 1 1 1   0 \
                           1 1 1 0.9 0 ')
          .attr('result', 'color');

        /*
        // translate output of Gaussian blur to the right and downwards with 2px
        // store result in offsetBlur
        filter.append("feOffset")
          .attr("in", "bluralpha")
          .attr("dx", 0)
          .attr("dy", 0)
          .attr("result", "offsetBlur");
         */

        // overlay original SourceGraphic over translated blurred opacity by using
        // feMerge filter. Order of specifying inputs is important!
        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
          .attr("in", "color");
        feMerge.append("feMergeNode")
          .attr("in", "SourceGraphic");

        // scaling functions

        var xOrdinal = d3.scale.ordinal().rangePoints([0, width]);

        var xLinear = d3.time.scale()
          .range([0, width]);

        //will get set dynamically to one of above, used in line function
        var xScale;

        var y = d3.scale.linear()
          .range([height, 0]);

        // Define the y axis - we'll define the x axis dynamically dep on whether linear

        var yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

        var xAxisEl = chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")");

        var yAxisEl = chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var xAxisLabel = chart.append("text")
          .attr("x", margin.left + (width / 2))
          .attr("y", margin.top + height + margin.bottom - labelHeight)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .text("Timepoint");

        var yAxisLabel = chart.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", labelHeight)
          .attr("x", -(margin.top + (height / 2)))
          .style("text-anchor", "middle")
          .text("Optical Density (OD)");

        var titleLabel = chart.append("text")
          .attr("x", margin.left + (width / 2))
          .attr("y", labelHeight)
          .style("text-anchor", "middle")
          .text("Growth Curve");

        //functions for retrieving values by key

        function getXScaled (d, i) {
          return d ? xScale(d.ordinal) : null;
        }

        function getYScaled (d, i) {
          return d ? y(+d.value) : 0;
        }

        //line generator (time / value for each well)
        var line = d3.svg.line()
          .interpolate(scope.interpolation || 'cardinal')
          .x(function (d) { return d.scaled.x; })
          .y(function (d) { return d.scaled.y; });

        //series generator (each well)
        var seriesContainer = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "series");

        //loupe setup

        var loupe = chart.append("g")
          .attr("visibility", "hidden")
          .attr("class", "loupe");

        var loupeDistance = 40;

        //point on the line
        loupe.append("circle")
          .attr('class', 'loupe-point')
          .attr("r", 5);
        loupe.append('line')
          .attr({
            x1: 0,
            y1: 0,
            x2: 0,
            y2: loupeDistance
          })
          .attr('class', 'loupe-line');
        //foreign object wrap... hard to deal with
        var loupeInnerFO = loupe.append("foreignObject")
          .attr({
            'y'     : loupeDistance,
            'x'     : '-150px',
            'class' : 'loupe-inner',
            'width' : '300px',
            'height': '50px'
          });
        //inner DOM
        var loupeInner = loupeInnerFO.append('xhtml:div')
          .attr('class', 'loupe-inner');
        var loupePill  = loupeInner.append('div')
          .attr('class', 'loupe-pill');
        var loupeText  = loupePill.append('p')
          .attr('class', 'loupe-text')
          .text('something');

        //voronoi setup

        var voronoiBuffer = 10;
        var voronoi       = d3.geom.voronoi()
          .x(function (d) { return d.scaled.x; })
          .y(function (d) { return d.scaled.y; })
          .clipExtent([[-voronoiBuffer, -voronoiBuffer], [width + voronoiBuffer, height + voronoiBuffer]]);

        var voronoiGroup = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "voronoi");
        //add class 'visible' for debugging

        //future - allow highlight of line by mouseover directly rather than just vonoroi??? hard to do voronoi on lines, especially if non-linear, because need to inteprolate based on surrounding values
        function voronoiMouseover (d) {
          var point = d.point;

          series.classed('selected', false);

          handleLineSelection(point.line);

          loupe.attr("transform", "translate(" + ( margin.left + point.scaled.x ) + "," + ( margin.top + point.scaled.y ) + ")")
            .attr('visibility', 'visible');
          loupeText.text(point.key + ' - ' + parseFloat(point.value, 10).toFixed(3));

          scope.$applyAsync(function () {
            scope.timepointSelected = point.ordinal;
            scope.onHover({$well: point.key, $ordinal : '' + point.ordinal, $value: parseFloat(point.value, 10)});
          });
        }

        function voronoiMouseout (d) {
          series.classed('selected', false);
          loupe.attr("visibility", "hidden");
          scope.$applyAsync(function () {
            scope.onHover();
            scope.timepointSelected = null;
          });
        }

        function handleLineSelection (nativeEl) {
          d3.select(nativeEl).classed('selected', true);
          nativeEl.parentNode.appendChild(nativeEl);
        }

        //save for later....
        var series;
        var voronoiSeries;
        var seriesData;
        var timepoints;

        /****
         Graph Updates
         ****/

        function drawGraph (data) {

          if (!data) return;

          timepoints = _.sortBy(_.keys(data), _.identity);

          seriesData = _.flatten(_.map(data, _.values));

          var extent = d3.extent(_.pluck(seriesData, 'value'));
          y.domain(extent).nice();

          //handle the x axis linear / ordinal
          if (scope.isLinear) {
            xScale = xLinear.domain(d3.extent(timepoints));
          } else {
            xScale = xOrdinal.domain(timepoints);
          }
          var xAxis = d3.svg.axis().scale(xScale)
            .orient("bottom").ticks(5);

          xAxisEl.transition().call(xAxis);
          yAxisEl.transition().call(yAxis);

          var rolledData = d3.nest()
            .key(function (d) { return d.key; })
            .rollup(function (vals) {
              return _.sortBy(vals, function (val) {
                val.scaled = {
                  x: getXScaled(val),
                  y: getYScaled(val)
                };
                return val.ordinal;
              });
            })
            .entries(seriesData);

          //Series lines

          series = seriesContainer.selectAll(".line")
            .data(rolledData, function (d) { return d.key });

          //ENTER
          series.enter().append("svg:path")
            .attr('class', 'line');

          //UPDATE - only updated values
          //note - we are actually changing the values when do this (i.e. this variable is exposed outside the scope of this directive)
          series.transition().attr('d', function (d) {
            _.map(d.values, function (val) {
              val.line = this;
            }, this);
            return line(d.values);
          });

          //EXIT
          series.exit().remove();

          drawVoronoi();

          //outward bind the extent of the data (e.g. for the plate)
          scope.extentData = y.domain();
        }

        function updateMeta (newval) {
          var metaToElement = {
            xlabel: {
              placeholder: 'Timepoint',
              element    : xAxisLabel
            },
            ylabel: {
              placeholder: 'Optical Density (OD)',
              element    : yAxisLabel
            },
            title : {
              placeholder: 'Growth Curve',
              element    : titleLabel
            }
          };

          _.forEach(newval, function (val, key) {
            var mapped = metaToElement[key];
            if (mapped) {
              mapped.element.text(val ? val : mapped.placeholder);
            }
          });
        }

        function handleSeriesSelection (selectedWells) {
          if (selectedWells) {
            var map = _.zipObject(selectedWells, true);//note - sets to undefined but doesn't matter
            highlightSeries(map);
            drawVoronoi(map);
          }
        }

        function highlightSeries (wellMap, oldval) {
          if (_.keys(wellMap).length < 1) {
            series.classed('hidden', false);
          } else {
            series.classed('hidden', function (d) { return !_.has(wellMap, d.key) });
          }
        }

        function drawVoronoi (wellMap) {

          if (seriesData) {

            var filteredSeriesData = !!_.keys(wellMap).length ?
              _.filter(seriesData, function (datum) { return _.has(wellMap, datum.key) }) :
              seriesData;

            var allDataUnique = d3.nest()
              .key(function (d) { return d.scaled.x + "," + d.scaled.y })
              .rollup(_.first)
              .entries(filteredSeriesData)
              .map(function (d) { return d.values });

            voronoiSeries = voronoiGroup.selectAll("path")
              .data(voronoi(allDataUnique));

            //exit first for perf
            voronoiSeries.exit().remove();

            voronoiSeries.enter().append("svg:path")
              .attr('d', function (d) {
                return "M" + d.join("L") + "Z";
              })
              .on("mouseover", voronoiMouseover)
              .on("mouseout", voronoiMouseout);

            //update
            voronoiSeries.attr('d', function (d) {
              return "M" + d.join("L") + "Z";
            });
          }

          if (_.keys(wellMap).length < 1) {
            voronoiSeries.classed('hidden', false);
          } else {
            voronoiSeries.classed('hidden', function (d) { return !_.has(wellMap, d.point.key) });
          }
        }
      }
    };
  });
