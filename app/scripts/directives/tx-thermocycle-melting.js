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

        var full   = {height: 130, width: 600},
            margin = {top: 30, right: 30, bottom: 30, left: 30},
            width  = full.width - margin.left - margin.right,
            height = full.height - margin.top - margin.bottom;

        var extraSpace = 15;

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
          .attr("stop-color", "#3268d4")
          .attr("stop-opacity", 1);

        tempGradient.append("svg:stop")
          .attr("offset", "100%")
          .attr("stop-color", "#d43232")
          .attr("stop-opacity", 1);

        var thermometerBack = svg.append('svg:rect')
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr({
            width : width,
            height: height
          })
          .style("fill", "url(#tempGradient)");

        var thermometerLines = svg.append("g")
          .attr("width", width)
          .attr("height", height)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

        var startLabel = thermometerLines.append('text').classed('temp-label', true),
            endLabel   = thermometerLines.append('text').classed('temp-label', true);

        hideLabels();

        function render () {
          var transitionDuration = 200,
              tempMin            = 0,
              tempMax            = 100,
              tempRange          = _.range(tempMin, tempMax+1),
              start              = _.result(scope.melting, 'start.value'),
              end                = _.result(scope.melting, 'end.value'),
              increment          = _.result(scope.melting, 'increment.value'),
              rate               = _.result(scope.melting, 'rate.value'),
              gradations         = _.range(start, end + 1, increment); //todo - make inclusive

          xScale.domain(tempRange);
          //xAxisEl.transition().duration(transitionDuration).call(xAxis);

          var tempLines = thermometerLines.selectAll('line')
            .data(gradations);

          tempLines.enter()
            .append('line')
            .classed('temp-line', true);

          tempLines
            .transition()
            .duration(transitionDuration)
            .attr({
              x1: xScale,
              x2: xScale,
              y1: function (d, i) {
                return (i == 0) ? -extraSpace : 0;
              },
              y2: function (d, i) {
                return (i == gradations.length - 1) ? (height + extraSpace) : height;
              }
            })
            .style({
              'stroke'      : function (d, i) {
                return (i == 0 || i == gradations.length - 1) ? 'white' : 'black';
              },
              'stroke-width': function (d, i) {
                return (i == 0 || i == gradations.length - 1) ? '3px' : '1px';
              }
            });

          tempLines.exit()
            .transition()
            .duration(transitionDuration)
            .style('opacity', 0)
            .remove();

          if (gradations.length) {
            startLabel.
              transition().
              duration(transitionDuration).
              attr({
                x: xScale(gradations[0]),
                y: - (extraSpace + 3) //note - hack
              }).
              style('opacity', 1).
              text(start + '°C');

            endLabel.
              transition().
              duration(transitionDuration).
              attr({
                x: xScale(_.last(gradations)),
                y: height + ( extraSpace * 2 )
              }).
              style('opacity', 1).
              text(end + '°C');
          }

          else {
            hideLabels();
          }
        }

        function hideLabels () {
          _.forEach([startLabel, endLabel], function (label) {
            label.style('opacity', 0);
          });
        }
      }
    }
  })
;
