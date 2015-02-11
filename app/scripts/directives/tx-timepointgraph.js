'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txTimepointgraph
 * @description
 * Expects data in form
 *
 * //todo - should we do this data folding (i.e. assign key, ordinal) internal to the directive? or outside?
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
 * And will dynamically figure out all keys and values. timepoints are ordinal values.
 */
angular.module('transcripticApp')
  .directive('txTimepointgraph', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data: '=',
        seriesSelected: '='
      },
      link: function postLink(scope, element, attrs) {

        scope.$watch('data', drawGraph);

        scope.$watch('seriesSelected', highlightSeries);

        /****
         Graph Construction
         ****/

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
            return x(d.ordinal);
          })
          .y(function(d, i) {
            //console.log(d.value, y(d.value));
            return y(d.value);
          });

        //series generator (each well)
        var seriesContainer = chart.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "series");

        //save for later....
        var series;

        //voronoi for highlighting lines

        var voronoi = d3.geom.voronoi()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); })
          .clipExtent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

        /****
         Graph Updates
         ****/

        function drawGraph (data) {

          if (!data) return;

          var timepoints = _.keys(data),
              wells = d3.set(_.flatten( _.map(timepoints, function (t) {
                return _.keys(data[t]);
              }))).values();

          x.domain(timepoints);
          y.domain([0, d3.max(_.values(data), _.flow(_.values, _.partialRight(_.pluck, 'value'), d3.max) ) ]).nice();

          xAxisEl.transition().call(xAxis);
          yAxisEl.transition().call(yAxis);

          series = seriesContainer.selectAll(".line")
            .data(wells, function (d, i) { return d; });

          //ENTER
          series.enter().append("svg:path")
            .attr('d', function (d) {
              return line(_.pluck(data, d));
            })
            .attr('class', 'line');

          //UPDATE - only updated values
          series.transition().attr('d', function (d) {
            return line(_.pluck(data, d));
          });

          //EXIT
          series.exit().remove();
        }

        function highlightSeries (newval, oldval) {
          if (!newval) return;

          var map = _.zipObject(newval, _.constant(true));
          series.classed('hidden', _.negate(_.partial(_.has, map)))
        }
      }
    };
  });
