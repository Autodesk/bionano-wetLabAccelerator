'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txPlategraph
 * @description
 * Expects data in form
 *
 * { "<well>" : [ {x : <timepoint>, y: <value> }, ... ], ... }
 *
 * Assumes all x values represented are present in first entry list
 */
//todo - d3 as module / dep?
angular.module('transcripticApp')
  .directive('txPlategraph', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data: '=',
        seriesHover: '=',
        seriesSelected: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', drawGraph);

        scope.$watch('seriesHover', highlightSeries);
        scope.$watch('seriesSelected', highlightSeriesArray);

        //chart setup

        var chart = d3.select(element[0])
                      .append('svg')
                      .attr('width', '100%')
                      .attr('height', '100%')
                      .attr('id', 'chart');

        var margin = {top: 20, right: 80, bottom: 30, left: 50},
            width = 640 - margin.left - margin.right,
            height = 380 - margin.top - margin.bottom;

        // scaling functions
        var x = d3.scale.ordinal().rangePoints([0, width]);

        var y = d3.scale.linear()
          .range([height, 0]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(5);

        var yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

        var xAxisEl = chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")");

        var yAxisEl = chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        yAxisEl.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Absorbance");

        //line generator (time / value for each well)
        var line = d3.svg.line()
          .interpolate('linear')
          .x(function(d, i) {
            return x(d.x);
          })
          .y(function(d, i) {
            return y(d.y);
          });

        //todo
        var voronoi = d3.geom.voronoi()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); })
          .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);


        //series generator (each well)
        var seriesContainer = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "series");

        //event capture layer
        var chartOverlay = chart.append("rect")
          .attr("class", "overlay")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr('width', width)
          .attr('height', height);

        //save for later....
        var series;

        /* focus circle */

        var focus = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .style("display", "none");

        // append the x line
        focus.append("line")
          .attr("class", "x")
          .style("stroke", "blue")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .attr("y1", 0)
          .attr("y2", height);

        // append the y line
        focus.append("line")
          .attr("class", "y")
          .style("stroke", "blue")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .attr("x1", width)
          .attr("x2", width);

        // append the circle at the intersection
        focus.append("circle")
          .attr("class", "y")
          .style("fill", "none")
          .style("stroke", "blue")
          .attr("r", 4);

        // place the value at the intersection
        focus.append("text")
          .attr("class", "y1")
          .style("stroke", "white")
          .style("stroke-width", "3.5px")
          .style("opacity", 0.8)
          .attr("dx", 8)
          .attr("dy", "-.3em");
        focus.append("text")
          .attr("class", "y2")
          .attr("dx", 8)
          .attr("dy", "-.3em");

        var focusHandleMousemove = _.noop;

        //bind events for focus
        chartOverlay.on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); });

        // updating the graph

        function drawGraph (data, olddata) {

          if (!data) return;

          console.log(data);

          var wells = _.keys(data),
              //note - assumes all timepoints in first step
          //todo- get the whole set: d3.set(data.map(function (d) { return d.x; })).values().sort()
              timepoints = _.pluck(data[wells[0]], 'x');

          x.domain(timepoints);
          y.domain([0, d3.max(_.values(data), function(time) { return d3.max(time, function(tp) { return +tp.y; }); })]).nice();

          xAxisEl.transition().call(xAxis);
          yAxisEl.transition().call(yAxis);

          series = seriesContainer.selectAll(".line")
                                  .data(wells,  function(d) { return d; });

          //get rid of old points
          series.exit().remove();

          //update - only updated values
          series.transition().attr('d', function(d) {
            return line(data[d]);
          });

          series.enter().append("svg:path")
                .attr('d', function(d) {
                  return line(data[d]);
                })
                .attr('class','line')
                .on("mouseover", onLineMouseover)
                .on("mouseout", onLineMouseout);

          /*
          //add a label for each line
          series.append("text")
                  .datum(function(d) { return {name: d, lastval: _.last(data[d]).y} })
                  .attr("transform", function(d, i) { return "translate(" + width + "," + y(d.lastval) + ")"; })
                  .attr("x", 3)
                  .attr("dy", ".35em")
                  .text(function(d) { return d.name; });

           */

          //todo - ensure bound once
          chartOverlay.on('mousemove', function () {

            var xpos = d3.mouse(this)[0],
                range = x.range(),
                closestX = _.chain(range).sortBy(function(a) {return Math.abs( a - xpos) }).take(1).value()[0],
                indexOfX = _.indexOf(range, closestX),
                timept = x.domain()[indexOfX];

            //dummy
            var d = {
              y : 0.5
            };

            focus.select(".x")
              .attr("transform", "translate(" + x(timept) + "," +  y(d.y) + ")")
              .attr("y2", height - y(d.y));

            focus.select(".y")
              .attr("transform", "translate(" + width * -1 + "," +  y(d.y) + ")")
              .attr("x2", width + width);
          });
        }

        /* functions for hover / select */

        //todo - optimize highlighting when we have it... or maybe store lines in map?

        var lastHovered,
            lastSelected;

        function onLineMouseover(d, i) {
          if (lastHovered != d) {
            lastHovered = d;
            scope.$apply(function () {
              scope.seriesHover = d;
            });
          }
        }

        function onLineMouseout(d) {
          scope.$apply(function () {
            lastHovered = null;
            scope.seriesHover = null;
          });
        }

        function highlightSeries (seriesName) {
          if (lastHovered != seriesName) {
            lastHovered = seriesName;
            series.classed('line-hover', false);

            if (seriesName) {
              series.filter(function (d, i) {
                return d == seriesName;
              }).classed('line-hover', true);
            }
          }
        }

        function highlightSeriesArray (seriesNames, oldval) {
          series.classed('line-hover', false);
          if (_.isArray(seriesNames) && seriesNames.length) {
            var seriesObj = _.zipObject(seriesNames, _.map(seriesNames, _.constant(true)));
            series.filter(function (d, i) {
              return !!seriesObj[d]
            }).classed('line-hover', true);
          }
        }
      }
    };
  });
