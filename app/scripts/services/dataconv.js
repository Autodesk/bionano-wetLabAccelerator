'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.DataConv
 * @description
 * # DataConv
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('DataConv', function (WellConv, ContainerOptions) {

    /**
     * @name parseGrowthCurve
     * @param {Object} rundata Data from a growth curve run in form:
     *
     *  {
     *    <timepoint> : {
     *      data : {
     *        <well> : [
     *          <well_value>
     *        ]
     *      },
     *      instruction : { operation : { object : <container> } } }
     *    }
     *  }
     * @param {Boolean} useTimes Whether should use times.
     * true - use `instruction.completed_at` for a linear scale
     * false|null - to use dataref for ordinal scale
     * @returns {Object} Data in form:
     *
     *  {
     *    <container> : {
     *      <timepoint> : {
     *        <well> : {
     *          {
     *            key : <well>,
     *            ordinal : <timepoint>,
     *            value : <well_value>
     *          }
     *        }
     *      }
     *    }
     *  }
     */
    function parseGrowthCurve (rundata, useTimes) {
      var timepoints   = _.keys(rundata),
          datarefs     = _.pick(rundata, function (d) { return d.id; }),
          instructions = _.pick(rundata, function (d) { return d.instruction.id; }),
          containers   = _.uniq(_.map(rundata, function (d) { return d.instruction.operation.object })),
          map          = {};

      _.forEach(containers, function (cont) { map[cont] = {} });

      _.forEach(rundata, function (ref, refkey) {
        var container = ref.instruction.operation.object,
            wells = _.map(_.keys(ref.data), _.capitalize);

        var ordinal = useTimes ? new Date(ref.instruction.completed_at).valueOf() : refkey;

        map[container][ordinal] = _.zipObject(wells, _.map(ref.data, function (well, wellkey) {
          return {
            key: wellkey.toUpperCase(),
            ordinal: ordinal,
            value: well[0]
          };
        }));
      });

      return map;
    }

    //note - only generates for one container
    function generateRandomGrowthCurve (container, numberTimepoints, prefix) {
      container = container || ContainerOptions[_.keys(ContainerOptions)[0]];
      numberTimepoints = numberTimepoints || 10;
      prefix = prefix || 'tp_';

      var wellCount = container.well_count,
          colCount = container.col_count,
          rowCount = wellCount / colCount,
          wellArray = WellConv.createArrayGivenBounds([0,1], [rowCount - 1, colCount]),
          timepointValues  = _.map( _.range(0, numberTimepoints), function (ind) {
            return prefix + ind;
          });

      return _.zipObject(
        timepointValues,
        _.map(
          _.range(0, numberTimepoints),
          function (index) {
            return createTimepointRandom(wellArray , timepointValues[index] );
          }
        )
      );
    }

    //helper for random growth curve
    function createTimepointRandom (wellArray, mapVal) {
      return _.zipObject(
        wellArray,
        _.map( wellArray, function (well) {
          return {
            key  : well,
            value: +(Math.random().toFixed(2)),
            ordinal : mapVal
          }
        })
      );
    }

    return {
      parseGrowthCurve : parseGrowthCurve,
      generateRandomGrowthCurve : generateRandomGrowthCurve,
      createTimepointRandom : createTimepointRandom
    }

  });
