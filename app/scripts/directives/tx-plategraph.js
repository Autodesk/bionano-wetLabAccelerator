'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txPlategraph
 * @description
 * # txPlategraph
 */
//todo - d3 as module / dep
angular.module('transcripticApp')
  .directive('txPlategraph', function () {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', drawGraph);

        var chart = d3.select(element[0])
                      .append('svg')
                      .attr('width', '100%')
                      .attr('height', '100%')
                      .attr('id', 'chart');

        var margin = {top: 20, right: 80, bottom: 30, left: 50},
            width = 640 - margin.left - margin.right,
            height = 380 - margin.top - margin.bottom;

        function drawGraph (data, olddata) {

          if (!data) return;

          var wells = _.keys(data),
              timepoints = _.pluck(data[wells[0]], 'dataref');

          // scaling functions
          var x = d3.scale.ordinal().domain(timepoints).rangePoints([0, width]);
          //todo - set dynamically
          var y = d3.scale.linear().range([height, 0]).domain([0,1.5]);

          // Define the axes
          var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5);

          var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

          chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")")
            .call(xAxis);

          chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(yAxis);

          //series generator (each well)
          var series = chart.selectAll('g.series')
                            .data(wells)
                            .enter()
                            .append('g')
                              .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                              .attr('class', 'series');

          //line generator (time / value for each well)
          var line = d3.svg.line()
                           .interpolate('basis')
                           .x(function(d, i) {
                             return x(d.dataref);
                           })
                           .y(function(d, i) {
                             return y(d.value);
                           });

          // add a line for each well
          series.selectAll('.line')
                .data(wells)
                .enter()
                .append('svg:path')
                .attr('d', function(d) {
                  return line(data[d]);
                })
                .attr('class','line');

          series.append("text")
                .datum(function(d) { return {name: d, lastval: _.last(data[d]).value} })
                .attr("transform", function(d, i) { return "translate(" + (margin.left + width) + "," + y(d.lastval) + ")"; })
                .attr("x", 3)
                .attr("dy", ".35em")
                .text(function(d) { return d.name; });
        }
      }
    };
  });
