'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AutoprotocolInstruction
 * @description
 * # AutoprotocolInstruction
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ConvAutoprotocolInstruction', function (InputTypes, AbstractionUtils, ConversionUtils) {
   var self = this;

    /* CONTAINER MANAGEMENT */

    self.cover = ConversionUtils.simpleMapOperation;
    self.uncover = ConversionUtils.simpleMapOperation;
    self.seal = ConversionUtils.simpleMapOperation;
    self.unseal = ConversionUtils.simpleMapOperation;

    /* SPECTROMETRY */

    //todo - update these to list container + wells - can't simple map
    self.fluorescence = ConversionUtils.simpleMapOperation;
    self.luminescence = ConversionUtils.simpleMapOperation;
    self.absorbance = ConversionUtils.simpleMapOperation;

    /* LIQUID HANDLING */

    self.transfer = function (op) {

      var transfers = [];

      var fromWells = AbstractionUtils.flattenAliquots(ConversionUtils.pluckFieldValueRaw(op.fields, 'from')),
          toWells = AbstractionUtils.flattenAliquots(ConversionUtils.pluckFieldValueRaw(op.fields, 'to'));

      //todo - eventually, we want to put some of this in 'requirements' for the operation (pending them all written to know what is consistent)
      if ( fromWells.length != toWells.length) {

        if (fromWells.length == 1) {
          _.fill(fromWells, fromWells[0], 0, toWells.length);
        } else {
          console.warn('transfer wells dont match up', toWells, fromWells);
          throw new Error('transfer wells dont match up');
        }
      }

      var volume = ConversionUtils.pluckFieldValueTransformed(op.fields, 'volume'),
          optionalFields = ['dispense_speed', 'aspirate_speed', 'mix_before', 'mix_after'],
          optionalObj = ConversionUtils.getFieldsIfSet(op.fields, optionalFields);

      //assuming that to_wells is always greater than from_wells
      _.forEach(toWells, function (toWell, index) {
        transfers.push(_.assign({
          volume: volume,
          to: toWell,
          from: fromWells[index]
        }, optionalObj));
      });

      return ConversionUtils.wrapInPipette({transfer : transfers});
    };

    self.consolidate = function (op) {

    };

    self.mix = function (op) {

    };

    self.distribute = function (op) {

    };

    self.dispense = function (op) {

    };

    /* TEMPERATURE */

    self.incubate = ConversionUtils.simpleMapOperation;

    //note - thermocycle has a lot of weird groups. But logic for those should be self-contained to the group.
    self.thermocycle = function (op) {

    };

    /* DNA */

    self.sanger_seq = function (op) {

    };

    self.gel_separate = function (op) {

    };
  });
