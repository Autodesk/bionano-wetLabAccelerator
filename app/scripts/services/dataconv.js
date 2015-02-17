'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.DataConv
 * @description
 * # DataConv
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('DataConv', function () {

    //todo - abstract once have more examples
    function parseGrowthCurve (rundata) {
      var timepoints   = _.keys(rundata),
          datarefs     = _.pick(rundata, function (d) { return d.id; }),
          instructions = _.pick(rundata, function (d) { return d.instruction.id; });

      //todo - need to convert all to uppercase

      var mapped = _.mapValues(rundata, function (ref, refkey) {
        var wells = _.map(_.keys(ref.data), _.capitalize);
        return _.zipObject(wells, _.map(ref.data, function (well, wellkey) {
          return {
            key: wellkey.toUpperCase(),
            ordinal: refkey,
            value: well[0]
          };
        }));
      });

      return mapped;

    }

    return {
      parseGrowthCurve : parseGrowthCurve
    }

  });
