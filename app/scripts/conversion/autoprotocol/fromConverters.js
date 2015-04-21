var _                    = require('lodash'),
    autoUtils            = require('./utils.js'),
    converterInstruction = {},
    converterField       = {},
    omniprotocol         = global.omniprotocol,
    omniUtils            = omniprotocol.utils,
    omniConv             = omniprotocol.conv;

/*******************
 Field Conversion
 *******************/

//todo - need to get dimensional value + unit defaults

function convertDimensionalWithDefault (omnidim, omnidef) {
  return autoUtils.convertDimensionalToAuto(_.assign({}, omnidef, omnidim));
}

//handle all dimensional converters at once
_.forEach(autoUtils.dimensionalFields, function (dimensional) {
  converterField[dimensional] = function (input, fieldObj) {
    return convertDimensionalWithDefault(input, _.result(fieldObj, 'default'));
  };
});

//todo - handle undefined!!!!!
function mapSomeDimensionalFields (input, defaults, dimensional, nondimensional) {
  return _.assign({},
    _.zipObject(dimensional, _.map(dimensional, function (dim) {
      return convertDimensionalWithDefault(_.result(input, dim, _.result(defaults, dim)));
    })),
    _.zipObject(nondimensional, _.map(nondimensional, function (nondim) {
      return _.result(input, nondim, _.result(defaults, nondim));
    }))
  );
}

//todo - might want to make each type explicit, rather than implicit use of _.identity
//only include special conversions, otherwise just use value (_.identity)

converterField.aliquot = _.flow(autoUtils.flattenAliquots, _.first);

converterField['aliquot+'] = autoUtils.flattenAliquots;

converterField.columnVolumes = function (input) {
  return _.map(input, function (colVol) {
    return {
      column: colVol.column,
      volume: colVol.volume
    };
  });
};

converterField.thermocycleGroup = function (input, fieldObj) {
  var inputDefault = _.result(fieldObj, 'default', {});
  return _.map(input, function (group) {
    return {
      cycles: group.cycles,
      steps : _.map(group.steps, function (step) {
        return _.assign({
            duration: convertDimensionalWithDefault(step.duration, inputDefault.duration),
            read    : _.result(step, 'read', true)
          }, (!!step.isGradient ?
          {
            gradient: {
              top: convertDimensionalWithDefault(step.gradientStart, inputDefault.gradientStart),
              end: convertDimensionalWithDefault(step.gradientEnd, inputDefault.gradientEnd)
            }
          } :
          {
            temperature: convertDimensionalWithDefault(step.temperature, inputDefault.temperature)
          }
          )
        );
      })
    };
  });
};


converterField.thermocycleDyes = function (input) {
  var filtered = _.filter(input, function (item) {
    return item.wells.length;
  });
  console.log(filtered);
  //todo
};

converterField.thermocycleMelting = function (input, fieldObj) {
  var fields = [ 'start', 'end', 'increment', 'rate'];
  return mapSomeDimensionalFields(input, _.result(fieldObj, 'default'), fields);
};


converterField.mixwrap = function (input, fieldObj) {
  return mapSomeDimensionalFields(input, _.result(fieldObj, 'default'), ['speed', 'volume'], ['repetitions']);
};

/*******************
 Instruction Conversion
 *******************/

function simpleMapOperation (op, localParams) {
  return _.assign({
    op: op.operation
  }, omniConv.simpleKeyvalFields(op.fields, localParams, converterField));
}

//takes an autoprotocol instruction, wraps in pipette group
function wrapInPipette (instruction) {
  return {
    op    : "pipette",
    groups: [instruction]
  };
}

converterInstruction.cover = simpleMapOperation;
converterInstruction.uncover = simpleMapOperation;
converterInstruction.seal = simpleMapOperation;
converterInstruction.unseal = simpleMapOperation;

/* SPECTROMETRY */

converterInstruction.fluorescence = _.flow(simpleMapOperation,
  _.partial(autoUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));
converterInstruction.luminescence = _.flow(simpleMapOperation,
  _.partial(autoUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));
converterInstruction.absorbance = _.flow(simpleMapOperation,
  _.partial(autoUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));

/* LIQUID HANDLING */

converterInstruction.transfer = function (op) {

  var fromWells      = autoUtils.flattenAliquots(omniUtils.pluckFieldValueRaw(op.fields, 'from')),
      toWells        = autoUtils.flattenAliquots(omniUtils.pluckFieldValueRaw(op.fields, 'to')),
      volume         = omniConv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
      optionalFields = ['dispense_speed', 'aspirate_speed', 'mix_before', 'mix_after'],
      optionalObj    = omniConv.getFieldsIfSet(op.fields, optionalFields, true, converterField),
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

  var xfers;
  if (omniUtils.pluckFieldValueRaw(op.fields, 'one_tip') === true) {
    xfers = {transfer: transfers};
  } else {
    xfers = _.map(transfers, function (xfer) {
      return {
        transfer : [xfer]
      };
    });
  }

  return wrapInPipette(xfers);
};

converterInstruction.consolidate = function (op) {
  var fromWells          = autoUtils.flattenAliquots(omniUtils.pluckFieldValueRaw(op.fields, 'from')),
      toWell             = omniConv.pluckFieldValueTransformed(op.fields, 'to', converterField),
      volume             = omniConv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
      optionalFromFields = ['aspirate_speed'],
      optionalAllFields  = ['dispense_speed', 'mix_after'],
      optionalFromObj    = omniConv.getFieldsIfSet(op.fields, optionalFromFields, true, converterField),
      optionalAllObj     = omniConv.getFieldsIfSet(op.fields, optionalAllFields, true, converterField),
      fromArray          = [];

  _.forEach(fromWells, function (fromWell) {
    fromArray.push(_.assign({
      volume: volume,
      well  : fromWell
    }, optionalFromObj))
  });

  debugger;

  var consolidates = _.assign({
    to  : toWell,
    from: fromArray
  }, optionalAllObj);

  return wrapInPipette({consolidate: consolidates});
};

converterInstruction.distribute = function (op) {
  //todo - pass converters to transformer
  var fromWell          = omniConv.pluckFieldValueTransformed(op.fields, 'from', converterField),
      toWells           = autoUtils.flattenAliquots(omniUtils.pluckFieldValueRaw(op.fields, 'to')),
      volume            = omniConv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
      optionalToFields  = ['dispense_speed'],
      optionalAllFields = ['aspirate_speed', 'mix_before'],
      optionalToObj     = omniConv.getFieldsIfSet(op.fields, optionalToFields, true, converterField),
      optionalAllObj    = omniConv.getFieldsIfSet(op.fields, optionalAllFields, true, converterField),
      toArray           = [];

  _.forEach(toWells, function (fromWell) {
    toArray.push(_.assign({
      volume: volume,
      well    : fromWell
    }, optionalToObj))
  });

  debugger;

  var distributes = _.assign({
    from: fromWell,
    to  : toArray
  }, optionalAllObj);

  return wrapInPipette({distribute: distributes});
};

converterInstruction.mix = function (op) {
  var wells          = omniConv.pluckFieldValueTransformed(op.fields, 'wells', converterField),
      optionalFields = ['repetitions', 'volume', 'speed'],
      optionalObj    = omniConv.getFieldsIfSet(op.fields, optionalFields, true, converterField);

  var mixes = _.map(wells, function (well) {
    return _.assign({
      well: well
    }, optionalObj);
  });

  return wrapInPipette({mix: mixes});
};

converterInstruction.dispense = function (op) {
  var volumesValue = omniConv.pluckFieldValueRaw(op.fields, 'columns'),
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

converterInstruction.spin = simpleMapOperation;

converterInstruction.store = simpleMapOperation;
converterInstruction.discard = simpleMapOperation;

module.exports = {
  field      : converterField,
  instruction: converterInstruction
};