/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.DataConv
 * @description
 * # DataConv
 * Service in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator')
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
     *
     *  Where timepoint is a dataref
     *
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
            wells     = _.map(_.keys(ref.data), _.capitalize);

        var ordinal = useTimes ? new Date(ref.instruction.completed_at).valueOf() : refkey;

        map[container][ordinal] = _.zipObject(wells, _.map(ref.data, function (well, wellkey) {
          return {
            key    : wellkey.toUpperCase(),
            ordinal: ordinal,
            value  : well[0]
          };
        }));
      });

      return map;
    }

    /**
     * @param rundata {Object} Given data in form (minimally including)
     *{
     * "<dataref>":{
     *   "data": {
     *      "postprocessed_data": {  // this is the important part
     *          "amp0":{
     *              "<dye_name>": {
     *                  "group_threshold": <integer>,
     *                  "baseline_subtracted_curve_fit":{
     *                      "<well_index>": [<readings>],
     *                      ...
     *                  }
     *              }
     *          }
     *      },
     *   },
     *   "container_type": {
     *     "well_count" : #,
     *     "col_count" : #,
     *   }
     * }
     *
     * @returns {Object} Data in form:
     *
     *  {
     *    <dye_name> : {
     *      <read_time> : {
     *        <well> : {
     *          {
     *            key : <well>,
     *            ordinal : <read_time>,
     *            value : <well_value>
     *          }
     *        }
     *      }
     *    }
     *  }
     */
    //todo - perf optimize... for loops?
    function parseThermocycle (rundata) {
      var dyesData = _.result(rundata, 'postprocessed_data.amp0'),
          dyes     = _.keys(dyesData),
          col_count =  _.result(rundata, 'container_type.col_count', 24),
          map      = {};

      _.forEach(dyes, function (dyename) {
        var dyeData  = _.result(dyesData[dyename], 'baseline_subtracted_curve_fit', []),
            wells    = _.keys(dyeData),
            numtimes = _.result(dyeData, wells[0], []).length;

        map[dyename] = {};

        _.forEach(_.range(numtimes), function (time) {
          map[dyename][time] = {};

          _.forEach(wells, function (well) {
            var alphanum = integerToAlphanum(col_count, well);

            map[dyename][time][alphanum] = {
              key : alphanum,
              ordinal: time,
              value: _.result(dyeData, well + '[' + time + ']')
            }
          });
        });
      });

      return map;
    }

    //note - only generates for one container
    function generateRandomGrowthCurve (container, numberTimepoints, prefix) {
      container        = container || ContainerOptions[_.keys(ContainerOptions)[0]];
      numberTimepoints = numberTimepoints || 10;
      prefix           = prefix || 'tp_';

      var wellCount       = container.well_count,
          colCount        = container.col_count,
          rowCount        = wellCount / colCount,
          wellArray       = WellConv.createArrayGivenBounds([0, 1], [rowCount - 1, colCount]),
          timepointValues = _.map(_.range(0, numberTimepoints), function (ind) {
            return prefix + ind;
          });

      return _.zipObject(
        timepointValues,
        _.map(
          _.range(0, numberTimepoints),
          function (index) {
            return createTimepointRandom(wellArray, timepointValues[index]);
          }
        )
      );
    }

    //helper for random growth curve
    function createTimepointRandom (wellArray, mapVal) {
      return _.zipObject(
        wellArray,
        _.map(wellArray, function (well) {
          return {
            key    : well,
            value  : +(Math.random().toFixed(2)),
            ordinal: mapVal
          }
        })
      );
    }

    function integerToAlphanum (numberColumns, integer) {
      return WellConv.letters[Math.floor(integer / numberColumns)] + ((integer % numberColumns) + 1);
    }

    return {
      parseGrowthCurve         : parseGrowthCurve,
      parseThermocycle         : parseThermocycle,
      generateRandomGrowthCurve: generateRandomGrowthCurve,
      createTimepointRandom    : createTimepointRandom,
      integerToAlphanum        : integerToAlphanum
    }

  });
