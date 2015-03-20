'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AutoprotocolInstruction
 * @description
 * # AutoprotocolInstruction
 * Service in the transcripticApp.
 * todo - once written, this should be integrated into Operations service
 */
angular.module('tx.conversion')
  .service('ConvAutoprotocolInstruction', function (InputTypes, AbstractionUtils, ConversionUtils) {
   var self = this;

    /* CONTAINER MANAGEMENT */

    self.cover = ConversionUtils.simpleMapOperation;
    self.uncover = ConversionUtils.simpleMapOperation;
    self.seal = ConversionUtils.simpleMapOperation;
    self.unseal = ConversionUtils.simpleMapOperation;

    /* SPECTROMETRY */

    self.fluorescence = _.flow(ConversionUtils.simpleMapOperation,
                               _.partial(ConversionUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));
    self.luminescence = _.flow(ConversionUtils.simpleMapOperation,
                               _.partial(ConversionUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));
    self.absorbance = _.flow(ConversionUtils.simpleMapOperation,
                             _.partial(ConversionUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));

    /* LIQUID HANDLING */

    self.transfer = function (op) {

      var fromWells = AbstractionUtils.flattenAliquots(AbstractionUtils.pluckFieldValueRaw(op.fields, 'from')),
          toWells = AbstractionUtils.flattenAliquots(AbstractionUtils.pluckFieldValueRaw(op.fields, 'to')),
          volume = ConversionUtils.pluckFieldValueTransformed(op.fields, 'volume'),
          optionalFields = [ 'dispense_speed' , 'aspirate_speed', 'mix_before' , 'mix_after' ],
          optionalObj = ConversionUtils.getFieldsIfSet(op.fields, optionalFields),
          transfers = [];

      //todo - eventually, we want to put some of this in 'requirements' for the operation (pending them all written to know what is consistent)
      if ( fromWells.length != toWells.length) {

        if (fromWells.length == 1) {
          _.fill(fromWells, fromWells[0], 0, toWells.length);
        } else {
          console.warn('transfer wells dont match up', toWells, fromWells);
          throw new Error('transfer wells dont match up');
        }
      }

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
      var fromWells = AbstractionUtils.flattenAliquots(AbstractionUtils.pluckFieldValueRaw(op.fields, 'from')),
          toWell = ConversionUtils.pluckFieldValueTransformed(op.fields, 'to'),
          volume = ConversionUtils.pluckFieldValueTransformed(op.fields, 'volume'),
          optionalFromFields = [ 'aspirate_speed' ],
          optionalAllFields = [ 'dispense_speed' , 'mix_after' ],
          optionalFromObj = ConversionUtils.getFieldsIfSet(op.fields, optionalFromFields),
          optionalAllObj = ConversionUtils.getFieldsIfSet(op.fields, optionalAllFields),
          fromArray = [];

      _.forEach(fromWells, function (fromWell) {
        fromArray.push(_.assign({
          volume: volume,
          from: fromWell
        }, optionalFromObj))
      });

      return _.assign({
        to: toWell,
        from: fromArray
      }, optionalAllFields);
    };

    self.distribute = function (op) {
      var fromWell = ConversionUtils.pluckFieldValueTransformed(op.fields, 'from'),
          toWells = AbstractionUtils.flattenAliquots(AbstractionUtils.pluckFieldValueRaw(op.fields, 'to')),
          volume = ConversionUtils.pluckFieldValueTransformed(op.fields, 'volume'),
          optionalToFields = [ 'dispense_speed' ],
          optionalAllFields = [ 'aspirate_speed' , 'mix_before' ],
          optionalToObj = ConversionUtils.getFieldsIfSet(op.fields, optionalToFields),
          optionalAllObj = ConversionUtils.getFieldsIfSet(op.fields, optionalAllFields),
          toArray = [];

      _.forEach(toWells, function (fromWell) {
        toArray.push(_.assign({
          volume: volume,
          to: fromWell
        }, optionalToObj))
      });

      return _.assign({
        from: fromWell,
        to: toArray
      }, optionalAllFields);
    };

    self.mix = function (op) {
      var wells = ConversionUtils.pluckFieldValueTransformed(op.fields, 'wells'),
          optionalFields = [ 'repetitions' , 'volume' , 'speed' ],
          optionalObj = ConversionUtils.getFieldsIfSet(op.fields, optionalFields, true);

      return _.map(wells, function (well) {
        return _.assign({
          well: well
        }, optionalObj);
      });
    };

    self.dispense = function (op) {
      var volumesValue = ConversionUtils.pluckFieldValueRaw(op.fields, 'columns'),
          container = _.result(_.first(volumesValue), 'container'),
          mapped = ConversionUtils.simpleMapOperation(op);

      return _.assign(mapped, {object : container});
    };

    /* TEMPERATURE */

    self.incubate = ConversionUtils.simpleMapOperation;


    self.thermocycle = ConversionUtils.simpleMapOperation;

    /* DNA */

    /*
    self.sangerseq = function (op) {};
     */

    self.gel_separate = ConversionUtils.simpleMapOperation;

    /* CONTAINER HANDLING */

    self.store = ConversionUtils.simpleMapOperation;
    self.discard = ConversionUtils.simpleMapOperation;

  });
