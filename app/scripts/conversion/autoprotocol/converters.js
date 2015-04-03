var _                    = require('lodash'),
    converterInstruction = {},
    converterField       = {},
    omniprotocol         = global.omniprotocol,
    utils                = omniprotocol.utils,
    conv                 = omniprotocol.conv;

/*******************
 Field Conversion
 *******************/

//only include special conversions, otherwise just use value (_.identity)

converterField.aliquot = _.flow(utils.flattenAliquots, _.first);

converterField['aliquot+'] = utils.flattenAliquots;

converterField.columnVolumes = function (input) {
  return _.map(input, function (colVol) {
    return {
      column: colVol.column,
      volume: colVol.volume
    };
  });
};

converterField.thermocycleGroup = function (input) {
  return _.map(input, function (group) {
    return {
      cycles: group.cycles,
      steps : _.map(group.steps, function (step) {
        return _.assign({
              duration: step.duration,
              read    : _.result(step, 'read', true)
            }, (step.isGradient ?
            {
              gradient: {
                top: step.gradientStart,
                end: step.gradientEnd
              }
            } :
            {
              temperature: step.temperature
            }
            )
        );
      })
    };
  });
};

converterField.thermocycleDyes = function (input) {
  return _.zipObject(
      _.pluck(input, 'dye'),
      input.wells
  );
};

/*******************
 Instruction Conversion
 *******************/

function simpleMapOperation (op, localParams) {
  return _.assign({
    op: op.operation
  }, conv.simpleKeyvalFields(op.fields, localParams, converterField));
}

converterInstruction.cover = simpleMapOperation;
converterInstruction.uncover = simpleMapOperation;
converterInstruction.seal = simpleMapOperation;
converterInstruction.unseal = simpleMapOperation;

/* SPECTROMETRY */

converterInstruction.fluorescence = _.flow(simpleMapOperation,
    _.partial(conv.pluckOperationContainerFromWells, _, 'object', 'wells'));
converterInstruction.luminescence = _.flow(simpleMapOperation,
    _.partial(conv.pluckOperationContainerFromWells, _, 'object', 'wells'));
converterInstruction.absorbance = _.flow(simpleMapOperation,
    _.partial(conv.pluckOperationContainerFromWells, _, 'object', 'wells'));

/* LIQUID HANDLING */

converterInstruction.transfer = function (op) {

  var fromWells      = utils.flattenAliquots(utils.pluckFieldValueRaw(op.fields, 'from')),
      toWells        = utils.flattenAliquots(utils.pluckFieldValueRaw(op.fields, 'to')),
      volume         = conv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
      optionalFields = ['dispense_speed', 'aspirate_speed', 'mix_before', 'mix_after'],
      optionalObj    = conv.getFieldsIfSet(op.fields, optionalFields),
      transfers      = [];

  //todo - eventually, we want to put some of this in 'requirements' for the operation (pending them all written to
  // know what is consistent)
  if (fromWells.length != toWells.length) {

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
      to    : toWell,
      from  : fromWells[index]
    }, optionalObj));
  });

  return wrapInPipette({transfer: transfers});
};

converterInstruction.consolidate = function (op) {
  var fromWells          = utils.flattenAliquots(utils.pluckFieldValueRaw(op.fields, 'from')),
      toWell             = conv.pluckFieldValueTransformed(op.fields, 'to', converterField),
      volume             = conv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
      optionalFromFields = ['aspirate_speed'],
      optionalAllFields  = ['dispense_speed', 'mix_after'],
      optionalFromObj    = conv.getFieldsIfSet(op.fields, optionalFromFields),
      optionalAllObj     = conv.getFieldsIfSet(op.fields, optionalAllFields),
      fromArray          = [];

  _.forEach(fromWells, function (fromWell) {
    fromArray.push(_.assign({
      volume: volume,
      from  : fromWell
    }, optionalFromObj))
  });

  return _.assign({
    to  : toWell,
    from: fromArray
  }, optionalAllFields);
};

converterInstruction.distribute = function (op) {
  //todo - pass converters to transformer
  var fromWell          = conv.pluckFieldValueTransformed(op.fields, 'from', converterField),
      toWells           = utils.flattenAliquots(utils.pluckFieldValueRaw(op.fields, 'to')),
      volume            = conv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
      optionalToFields  = ['dispense_speed'],
      optionalAllFields = ['aspirate_speed', 'mix_before'],
      optionalToObj     = conv.getFieldsIfSet(op.fields, optionalToFields),
      optionalAllObj    = conv.getFieldsIfSet(op.fields, optionalAllFields),
      toArray           = [];

  _.forEach(toWells, function (fromWell) {
    toArray.push(_.assign({
      volume: volume,
      to    : fromWell
    }, optionalToObj))
  });

  return _.assign({
    from: fromWell,
    to  : toArray
  }, optionalAllFields);
};

converterInstruction.mix = function (op) {
  var wells          = conv.pluckFieldValueTransformed(op.fields, 'wells', converterField),
      optionalFields = ['repetitions', 'volume', 'speed'],
      optionalObj    = conv.getFieldsIfSet(op.fields, optionalFields, true);

  return _.map(wells, function (well) {
    return _.assign({
      well: well
    }, optionalObj);
  });
};

converterInstruction.dispense = function (op) {
  var volumesValue = conv.pluckFieldValueRaw(op.fields, 'columns'),
      container    = _.result(_.first(volumesValue), 'container'),
      mapped       = simpleMapOperation(op);

  return _.assign(mapped, {object: container});
};

/* TEMPERATURE */

converterInstruction.incubate = simpleMapOperation;


converterInstruction.thermocycle = simpleMapOperation;

/* DNA */

/*
 convertInstruction.sangerseq = function (op) {};
 */

converterInstruction.gel_separate = simpleMapOperation;

/* CONTAINER HANDLING */

converterInstruction.store = simpleMapOperation;
converterInstruction.discard = simpleMapOperation;

module.exports = {
  field      : converterField,
  instruction: converterInstruction
};