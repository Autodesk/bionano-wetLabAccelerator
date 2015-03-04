'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AutoprotocolInstruction
 * @description
 * # AutoprotocolInstruction
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ConvAutoprotocolInstruction', function (ConvAutoprotocolType, AbstractionUtils, ConversionUtils) {
   var self = this;

    function pluckField (fields, fieldName) {
      return _.find(fields, {name : fieldName});
    }

    function pluckFieldValue (fields, fieldName) {
      return _.result(pluckField(fields, fieldName), 'value');
    }

    self.cover = ConversionUtils.simpleMapOperation;
    self.uncover = ConversionUtils.simpleMapOperation;
    self.seal = ConversionUtils.simpleMapOperation;
    self.unseal = ConversionUtils.simpleMapOperation;

    self.fluorescence = ConversionUtils.simpleMapOperation;
    self.luminescence = ConversionUtils.simpleMapOperation;
    self.absorbance = ConversionUtils.simpleMapOperation;

    //todo - intelligently handle allow_carryover for pipette steps

    self.transfer = function (op) {

      var transfers = [];

      var fromWells = AbstractionUtils.flattenAliquots(pluckFieldValue(op.fields, 'from')),
          toWells = AbstractionUtils.flattenAliquots(pluckFieldValue(op.fields, 'to'));

      if ( fromWells.length != toWells.length) {

        if (fromWells.length == 1) {
          _.fill(fromWells, fromWells[0], 0, toWells.length);
        } else {
          console.warn('transfer wells dont match up', toWells, fromWells);
          throw new Error('transfer wells dont match up');
        }
      }

      var volume = pluckFieldValue(op.fields, 'volume'),
          mix_after = ConvAutoprotocolType.mixwrap(pluckFieldValue(op.fields, 'mix_after'));

      //assuming that to_wells is always greater than from_wells
      _.forEach(toWells, function (toWell, index) {

        transfers.push({
          volume: volume,
          to: toWell,
          from: fromWells[index],
          mix_after: mix_after
        });
      });

      return ConversionUtils.wrapInPipette({transfer : transfers});
    };

    self.gel_separate = function (op) {

    };
  });
