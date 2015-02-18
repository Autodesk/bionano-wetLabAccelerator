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
 * And will dynamically figure out all keys and values. timepoints are ordinal values.
 */
angular.module('transcripticApp')
  .directive('txTimepointgraph', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data: '=',
        graphMeta: '=', //accepts xlabel, ylabel, title
        seriesSelected: '='
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
          .text("Absorbance");

        var titleLabel = chart.append("text")
          .attr("x", margin.left + (width / 2) )
          .attr("y", labelHeight)
          .style("text-anchor", "middle")
          .text("Growth Curve");

        //line generator (time / value for each well)
        //todo - need to handle key not being present for given ordinal - shouldn't display line
        var line = d3.svg.line()
          .interpolate('linear')
          .x(function(d, i) {
            return d ? x(d.ordinal) : null;
          })
          .y(function(d, i) {
            return d ? y(d.value) : 0;
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
            .data(wells, function (d, i) { return d.toUpperCase(); });

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

        function updateMeta (newval) {
          var metaToElement = {
            xlabel : {
              placeholder : 'Timepoint',
              element : xAxisLabel
            },
            ylabel : {
              placeholder : 'Absorbance',
              element : xAxisLabel
            },
            title : {
              placeholder : 'Growth Curve',
              element : xAxisLabel
            }
          };

          _.forEach(newval, function (val, key) {
            var mapped = metaToElement[key];
            if (mapped) {
              mapped.element.text(val ? val : mapped.placeholder);
            }
          });
        }

        function highlightSeries (newval, oldval) {
          if (!newval || !newval.length) {
            series.classed('hidden', false);
          } else {
            var map = _.zipObject(newval, _.constant(true));
            series.classed('hidden', _.negate(_.partial(_.has, map)))
          }
        }
      }
    };
  });
