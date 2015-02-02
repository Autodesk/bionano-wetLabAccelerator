'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txPlategraph
 * @description
 * Expects data in form
 *
 * { "<key>" : [ {x : <domain_value>, y: <range_value> }, ... ], ... }
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
          .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")")

        var yAxisEl = chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

        //line generator (time / value for each well)
        var line = d3.svg.line()
          .interpolate('linear')
          .x(function(d, i) {
            return x(d.x);
          })
          .y(function(d, i) {
            return y(d.y);
          });

        //series generator (each well)
        var seriesContainer = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "series");

        //save for later....
        var series,
            focus;

        // functions

        function drawGraph (data, olddata) {

          if (!data) return;

          var wells = _.keys(data),
              //note - assumes all timepoints in first step
              timepoints = _.pluck(data[wells[0]], 'x');

          x.domain(timepoints);
          y.domain([0, d3.max(_.values(data), function(time) { return d3.max(time, function(tp) { return +tp.y; }); })]).nice();

          xAxisEl.call(xAxis);
          yAxisEl.call(yAxis);

          series = seriesContainer.selectAll(".line")
                                  .data(wells,  function(d) { return d; });

          //get rid of old points
          series.exit().remove();

          series.enter().append("svg:path")
                .attr('d', function(d) {
                  return line(data[d]);
                })
                .attr('class','line')
                .on("mouseover", onLineMouseover)
                .on("mouseout", onLineMouseout);

          //perf? -- want to update, does this overlap?
          series.attr('d', function(d) {
            return line(data[d]);
          });

          /*
          //add a label for each line
          series.append("text")
                  .datum(function(d) { return {name: d, lastval: _.last(data[d]).y} })
                  .attr("transform", function(d, i) { return "translate(" + width + "," + y(d.lastval) + ")"; })
                  .attr("x", 3)
                  .attr("dy", ".35em")
                  .text(function(d) { return d.name; });

           */

          /*
          //not using
          //handle hover focus
          focus = chart.append("g")
            .attr("transform", "translate(-100,-100)")
            .attr("class", "focus");

          focus.append("circle")
            .attr("r", 3.5);

          focus.append("text")
            .attr("y", -10);
          */


        }

        //todo - optimize highlighting when we have it... or maybe store lines in map?
        function onLineMouseover(d, i) {
          scope.$apply(function () {
            scope.seriesHover = d;
          });
        }

        function onLineMouseout(d) {
          scope.$apply(function () {
            scope.seriesHover = null;
          });
        }

        function highlightSeries (seriesName, oldval) {
          series.classed('line-hover', false);
          if (seriesName) {
            series.filter(function (d, i) {
              return d == seriesName;
            }).classed('line-hover', true);
          }
        }

        function highlightSeriesArray (seriesNames, oldval) {
          series.classed('line-hover', false);
          if (_.isArray(seriesNames) && seriesNames.length) {
            series.filter(function (d, i) {
              return _.contains(seriesNames, d);
            }).classed('line-hover', true);
          }
        }
      }
    };
  });
