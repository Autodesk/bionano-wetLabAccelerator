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
 */
angular.module('transcripticApp')
  .directive('txTimepointgraph', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data: '=',
        graphMeta: '=', //accepts xlabel, ylabel, title
        seriesSelected: '=',
        isLinear: '='
      },
      link: function postLink(scope, element, attrs) {

        scope.$watch('data', drawGraph);
        scope.$watch('graphMeta', updateMeta, true);

        scope.$watch('seriesSelected', handleSeriesSelection);

        /****
         Graph Construction
         ****/

        var full = {
          height : 380,
          width: 600
        };

        var chart = d3.select(element[0])
          .append('svg')
          .attr('width', full.width)
          .attr('height', full.height)
          .attr('id', 'chart');

        var labelHeight = 15,
            margin = {top: 15 + labelHeight, right: 15, bottom: 30 + labelHeight, left: 40 + labelHeight},
            width = full.width - margin.left - margin.right,
            height = full.height - margin.top - margin.bottom;

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
          .attr("x", margin.left + (width / 2) )
          .attr("y", margin.top + height + margin.bottom - labelHeight)
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .text("Timepoint");

        var yAxisLabel = chart.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", labelHeight)
          .attr("x", -(margin.top + (height / 2)) )
          .style("text-anchor", "middle")
          .text("Optical Density (OD)");

        var titleLabel = chart.append("text")
          .attr("x", margin.left + (width / 2) )
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
          .interpolate('linear')
          .x(function (d) { return d.scaled.x; })
          .y(function (d) { return d.scaled.y; });

        //series generator (each well)
        var seriesContainer = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "series");

        //voronoi setup

        var voronoi = d3.geom.voronoi()
          .x(function (d) { return d.scaled.x; })
          .y(function (d) { return d.scaled.y; })
          .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

        var voronoiFocus = chart.append("g")
          .attr("transform", "translate(-100,-100)")
          .attr("class", "focus");

        voronoiFocus.append("circle")
          .attr("r", 3.5);

        voronoiFocus.append("text")
          .attr("y", -10);

        var voronoiGroup = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "voronoi");
        //add class 'visible' for debugging

        //todo - allow highlight of line by mouseover directly rather than just vonoroi
        function voronoiMouseover (d) {
          var point = d.point;

          series.classed('selected', false);
          d3.select(point.line).classed('selected', true);
          point.line.parentNode.appendChild(point.line);

          voronoiFocus.attr("transform", "translate(" + ( margin.left + point.scaled.x ) + "," + ( margin.top + point.scaled.y ) + ")");
          voronoiFocus.select("text").text(point.key + ' - ' + parseFloat(point.value, 10).toFixed(3));
        }

        function voronoiMouseout (d) {
          series.classed('selected', false);
          voronoiFocus.attr("transform", "translate(-100,-100)");
        }

        //save for later....
        var series;
        var voronoiSeries;
        var seriesData;

        /****
         Graph Updates
         ****/

        function drawGraph (data) {

          if (!data) return;

          var timepoints = _.keys(data);

          seriesData = _.flatten(_.map(data, _.values));

          y.domain([0, d3.max( _.pluck(seriesData, 'value') ) ]).nice();

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
              _.map(vals, function (val) {
                val.scaled = {
                  x : getXScaled(val),
                  y : getYScaled(val)
                };
              });
              return vals;
            })
            .entries(seriesData);

          //Series lines

          series = seriesContainer.selectAll(".line")
            .data(rolledData, function (d) { return d.key });

          //ENTER
          series.enter().append("svg:path")
            .attr('class', 'line');

          //UPDATE - only updated values
          series.transition().attr('d', function (d) {
            _.map(d.values, function (val) {
              val.line = this;
            }, this);
            return line(d.values);
          });

          //EXIT
          series.exit().remove();

          drawVoronoi()
        }

        function updateMeta (newval) {
          var metaToElement = {
            xlabel : {
              placeholder : 'Timepoint',
              element : xAxisLabel
            },
            ylabel : {
              placeholder : 'Optical Density (OD)',
              element : yAxisLabel
            },
            title : {
              placeholder : 'Growth Curve',
              element : titleLabel
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
          var map = _.zipObject(selectedWells, true); //note - sets to undefined but doesn't matter
          highlightSeries(map);
          drawVoronoi(map);
        }

        function highlightSeries (wellMap, oldval) {
          if (_.keys(wellMap).length < 1) {
            series.classed('hidden', false);
          } else {
            series.classed('hidden', function (d) { return ! _.has(wellMap, d.key) });
          }
        }

        function drawVoronoi (wellMap) {

          if (seriesData) {

            var filteredSeriesData = !! _.keys(wellMap).length ?
              _.filter(seriesData, function (datum) { return _.has(wellMap, datum.key) }) :
              seriesData;

            var allDataUnique = d3.nest()
              .key(function(d) { return d.scaled.x + "," + d.scaled.y })
              .rollup(_.first)
              .entries(filteredSeriesData)
              .map(function(d) { return d.values });

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
            voronoiSeries.classed('hidden', function (d) { return ! _.has(wellMap, d.point.key) });
          }
        }
      }
    };
  });
