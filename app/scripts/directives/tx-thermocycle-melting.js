'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txThermocycleMelting
 * @description
 * # txThermocycleMelting
 */
angular.module('transcripticApp')
  .directive('txThermocycleMelting', function () {
    return {
      restrict: 'E',
      scope   : {
        melting: '='
      },
      link    : function postLink (scope, element, attrs) {
        scope.$watch('melting', render, true);

        var full   = {height: 100, width: 600},
            margin = {top: 30, right: 15, bottom: 15, left: 15},
            width  = full.width - margin.left - margin.right,
            height = full.height - margin.top - margin.bottom;

        //container SVG
        var svg = d3.select(element[0]).append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", "0 0 " + full.width + " " + full.height)
          .attr("preserveAspectRatio", "xMidYMid meet");

        scope.$watch(function () {
          return element[0].offsetWidth;
        }, function (newWidth) {
          element.attr('height', (newWidth / full.width) * full.height);
        });

        var tempGradient = svg.append("svg:defs")
          .append("svg:linearGradient")
          .attr("id", "tempGradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0")
          .attr("spreadMethod", "pad");

        tempGradient.append("svg:stop")
          .attr("offset", "0%")
          .attr("stop-color", "#00d")
          .attr("stop-opacity", 1);

        tempGradient.append("svg:stop")
          .attr("offset", "100%")
          .attr("stop-color", "#d00")
          .attr("stop-opacity", 1);

        var thermometer = svg.append("g")
          .attr("width", width)
          .attr("height", height)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var thermometerBack = thermometer.append('svg:rect')
          .attr({
            width: '100%',
            height: '100%'
          })
          .style("fill", "url(#tempGradient)");

        //scales
        var xScale = d3.scale
          .ordinal()
          .rangeBands([0, width]);

        //axes
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("top");

        //axes elements
        var xAxisEl = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function render () {
          var transitionDuration = 200,
              tempRange          = _.range(100),
              start              = _.result(scope.melting, 'start.value'),
              end                = _.result(scope.melting, 'end.value'),
              increment          = _.result(scope.melting, 'increment.value'),
              rate               = _.result(scope.melting, 'rate.value'),
              gradations         = _.range(start, end, increment);

          //xScale.domain(tempRange);
          //xAxisEl.transition().duration(transitionDuration).call(xAxis);

          var tempLines = thermometer.selectAll('line')
            .data(gradations);

          tempLines.enter()
            .append('line')
            .classed('temp-line', true)
            .style('stroke', 'white');

          tempLines.attr({
            x1: function (d, i) {
              return d + '%'
            },
            x2 : function (d, i) {
              return d + '%'
            },
            y1: 0,
            y2: '100%'
          })


        }
      }
    };
  });
