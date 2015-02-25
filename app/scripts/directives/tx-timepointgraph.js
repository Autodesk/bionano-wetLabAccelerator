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

        scope.$watch('seriesSelected', highlightSeries);

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
        //todo - need to handle key not being present for given ordinal - shouldn't display line? or just interpolate?
        var line = d3.svg.line()
          .interpolate('linear')
          .x(getXScaled)
          .y(getYScaled);

        //series generator (each well)
        var seriesContainer = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "series");

        //save for later....
        var series;

        //voronoi setup

        var voronoi = d3.geom.voronoi()
          .x(function (d, i) {
            //console.log(d, i);
            return getXScaled(d);
          })
          .y(getYScaled)
          .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

        var voronoiFocus = chart.append("g")
          //.attr("transform", "translate(-100,-100)")
          .attr("class", "focus");

        voronoiFocus.append("circle")
          .attr("r", 3.5);

        voronoiFocus.append("text")
          .attr("y", -10);

        var voronoiGroup = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "voronoi");

        //todo - should bind element to data, and use directly
        function voronoiMouseover (d) {
          //console.log(d);

          var point = d.point;
          var pointkey = d.point.key;

          series.classed('selected', false);
          var line = series.filter(function (sel) { return sel.key == pointkey })
                .classed('selected', true),
              lineEl = line[0][0];
          lineEl.parentNode.appendChild(lineEl);

          voronoiFocus.attr("transform", "translate(" + ( margin.left + getXScaled(point) ) + "," + ( margin.top + getYScaled(point) ) + ")");
          voronoiFocus.select("text").text(point.key + ' - ' + parseFloat(point.value, 10).toFixed(3));
        }

        function voronoiMouseout (d) {
          series.classed('selected', false);
          voronoiFocus.attr("transform", "translate(-100,-100)");
        }

        var voronoiSeries;

        /****
         Graph Updates
         ****/

        function drawGraph (data) {

          if (!data) return;

          //todo - use same objects for series + voronoi so that can share data between each
          var timepoints = _.keys(data),
              allDataFlattened = _.flatten(_.map(data, _.values)),
              rolledByWell = d3.nest()
                .key(function (d) { return d.key; })
                .entries(allDataFlattened),
              wells = _.pluck(rolledByWell, 'key');

          y.domain([0, d3.max( _.pluck(allDataFlattened, 'value') ) ]).nice();

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


          var allDataUnique = d3.nest()
            .key(function(d) { return getXScaled(d) + "," + getYScaled(d); })
            .rollup(_.first)
            .entries(allDataFlattened)
            .map(function(d) { return d.values });

          //console.log(allDataUnique);


          //Series lines

          series = seriesContainer.selectAll(".line")
            .data(rolledByWell, function (d) { return d.key });

          //ENTER
          series.enter().append("svg:path")
            .attr('d', function (d, i) {
              d.line = this;
              d.path = line(d.values);
              return d.path;
            })
            .attr('class', 'line');

          //UPDATE - only updated values
          series.transition().attr('d', function (d) {
            return line(d.values);
          });

          //EXIT
          series.exit().remove();

          //VORONOI
          drawVoronoi(allDataUnique);
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

        function highlightSeries (selectedWells, oldval) {
          if (!selectedWells || !selectedWells.length) {
            series.classed('hidden', false);
          } else {
            var map = _.zipObject(selectedWells, true); //note - sets to undefined but doesn't matter
            series.classed('hidden', function (d) { return ! _.has(map, d.key) });
          }

          drawVoronoi(null, selectedWells);
        }

        function drawVoronoi (data, selectedWells) {

          if (data && data.length) {
            voronoiSeries = voronoiGroup.selectAll("path")
              .data(voronoi(data));

            //exit first for perf
            voronoiSeries.exit().remove();

            voronoiSeries.enter().append("svg:path")
              .attr('d', function (d) {
                console.log(d);
                console.log("M" + d.join("L") + "Z");
                return "M" + d.join("L") + "Z";
              })
              //.datum(function(d) { return d.point; })
              .on("mouseover", voronoiMouseover)
              .on("mouseout", voronoiMouseout);

            voronoiSeries.attr('d', function (d) {
              //console.log(d);
              return "M" + d.join("L") + "Z";
            });
          }

          if (!selectedWells || !selectedWells.length) {
            voronoiSeries.classed('hidden', false);
          } else {
            var map = _.zipObject(selectedWells, true); //note - sets to undefined but doesn't matter
            voronoiSeries.classed('hidden', function (d) { return ! _.has(map, d.point.key) });
          }
        }
      }
    };
  });
