'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txThermocycleGroup
 * @description
 * # txThermocycleGroup
 *
 * Draws a graph given some thermocycle data
 * //todo - handle gradients..
 */
angular.module('transcripticApp')
  .directive('txThermocycleGroup', function (Omniprotocol) {
    return {
      restrict: 'E',
      scope   : {
        group: '='
      },
      link    : function postLink (scope, element, attrs) {

        scope.$watch('group', render, true);


        /* CONSTRUCTING THE SVG */

        var full   = {height: 425, width: 600},
            margin = {top: 30, right: 30, bottom: 30, left: 30},
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
          .attr("id", "tempGradientVert")
          .attr("x1", "0")
          .attr("y1", "0")
          .attr("x2", "0")
          .attr("y2", "100%")
          .attr("spreadMethod", "pad");

        tempGradient.append("svg:stop")
          .attr("offset", "0%")
          .attr("stop-color", "#d43232")
          .attr("stop-opacity", 1);

        tempGradient.append("svg:stop")
          .attr("offset", "100%")
          .attr("stop-color", "#3268d4")
          .attr("stop-opacity", 1);

        var graphSvg = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //scales
        var xScale = d3.scale
          .linear()
          .range([0, width]);

        var yScale = d3.scale
          .ordinal()
          .rangeBands([0, height]);

        //axes
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");

        var yAxis = d3.svg.axis()
          .scale(yScale)
          .ticks(2)
          .tickFormat('')
          .orient("left");

        //axes elements
        var xAxisEl = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")");

        var yAxisEl = svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        var lines = getAllLines();

        function render () {
          var transitionDuration = 200,
              tempMin            = 0,
              tempMax            = 100,
              tempRange          = _.range(tempMax, tempMin - 1, -1),
              rampPerSecond      = 3.5,
              graphData          = graphDataFromGroup(scope.group),
              withSpacings       = _(graphData)
                .map(function (datum, index) {
                  var nextItem       = _.result(graphData, index + 1),
                      spaceStartTemp = _.result(datum, 'temp.end'),
                      spaceEndTemp   = _.result(nextItem, 'temp.start'),
                      difference     = Math.abs(spaceStartTemp - spaceEndTemp),
                      spaceTime      = (!_.isNumber(spaceEndTemp) || !_.isNumber(spaceStartTemp) || _.isUndefined(nextItem)) ? 0 : (Math.floor(difference / rampPerSecond) + 1),
                      spacing        = (spaceTime == 0) ? null : {
                        time   : spaceTime,
                        spacing: true,
                        temp   : {
                          start: spaceStartTemp,
                          end  : spaceEndTemp
                        }
                      };

                  return [datum, spacing];
                })
                .flatten()
                .compact()
                .value(),
              combinedLength     = _.reduce(withSpacings, function (currentTime, datum) {
                var stepTime  = _.result(datum, 'time', 0),
                    timeAfter = currentTime + stepTime;

                _.assign(datum, {
                  time: {
                    start: currentTime,
                    end  : timeAfter
                  }
                });

                return timeAfter;
              }, 0);

          console.log('made variables', combinedLength, withSpacings, graphData);


          xScale.domain([0, combinedLength]);
          yScale.domain(tempRange);

          xAxisEl.transition().duration(transitionDuration).call(xAxis);
          yAxisEl.transition().duration(transitionDuration).call(yAxis);

          yAxisEl.select('path').style('fill', 'url(#tempGradientVert)');

          lines = getAllLines()
            .data(withSpacings);

          lines.enter()
            .append('line')
            .classed('thermocycle-line', true);

          lines.transition()
            .duration(transitionDuration)
            .attr({
              x1: function (d) {
                return xScale(_.result(d, 'time.start', 0));
              },
              y1: function (d) {
                return yScale(_.result(d, 'temp.start', 0));
              },
              x2: function (d) {
                return xScale(_.result(d, 'time.end', 0));
              },
              y2: function (d) {
                return yScale(_.result(d, 'temp.end', 0));
              }
            });

          lines.each(function (d) {
            console.log(d);
          });

          lines.exit()
            .remove();

          console.log('made lines');
        }


        //helpers

        function graphDataFromGroup (thermocycleGroup) {
          if (! _.result(thermocycleGroup, 'steps', []).length) {
            return;
          }

          return _.map(thermocycleGroup.steps, function (step) {
            return {
              time   : timeToSeconds(step.duration),
              temp   : {
                start: tempFromDim(step.temperature),
                end  : tempFromDim(step.temperature)
              },
              spacing: false
            };
          });
        }

        function getAllLines () {
          return graphSvg.selectAll('line');
        }

        function tempFromDim (dim) {
          return _.result(dim, 'value');
        }

        function timeToSeconds (dim) {
          var scale = {
            'millisecond': 0.001,
            'second'     : 1,
            'minute'     : 60,
            'hour'       : (60 * 60)
          };

          return (_.result(dim, 'value', 0) * _.result(scale, _.result(dim, 'unit'), 1));
        }

      }
    };
  });
