var _                    = require('lodash'),
    autoUtils            = require('./utils.js'),
    converterInstruction = {},
    converterField       = {},
    omniprotocol         = global.omniprotocol,
    omniUtils            = omniprotocol.utils,
    omniConv             = omniprotocol.conv;

/*** Error helper ***/

function throwFieldError (message, op, fieldName) {
  var fieldObj = omniUtils.pluckField(op.fields, fieldName);
  throw new ConversionError(message, fieldObj, fieldName, op.$index);
}

/*******************
 Field Conversion
 *******************/

//todo - need to get dimensional value + unit defaults, use a default unit based on type

function convertDimensionalWithDefault (omnidim, omnidef) {
  return autoUtils.convertDimensionalToAuto(_.assign({}, omnidef, omnidim));
}

//handle all dimensional converters at once
_.forEach(autoUtils.dimensionalFields, function (dimensional) {
  converterField[dimensional] = function (input, fieldObj) {
    return convertDimensionalWithDefault(input, _.result(fieldObj, 'default'));
  };
});

//todo - handle undefined
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

converterField.container = function (input, fieldObj) {
  return _.result(input, 'containerName');
};

converterField.aliquot = _.flow(autoUtils.flattenAliquots, _.first);

converterField['aliquot+'] = autoUtils.flattenAliquots;

//future - need to handle differently, but right now this basically is just aliquot+
converterField['aliquot++'] = autoUtils.flattenAliquots;

converterField.columnVolumes = function (input) {
  return _.flatten(_.map(input, function (colVol) {
    return _.map(colVol.columns, function (col) {
      return {
        column: parseInt(col, 10),
        volume: convertDimensionalWithDefault(colVol.volume, {unit: 'microliter', value: '100'})
      };
    });
  }));
};

converterField.thermocycleGroups = function (input, fieldObj) {
  var inputDefault = _.result(fieldObj, 'default', {}); //right now, this isn't anything
  return _.map(input, function (group) {
    return converterField.thermocycleGroup(group.value, _.assign({}, inputDefault, group));
  });
};

converterField.thermocycleGroup = function (input, fieldObj) {
  var inputDefault = _.result(fieldObj, 'default', {});
  return {
    cycles: input.cycles,
    steps : _.map(input.steps, function (step) {
      return _.assign({
          duration: convertDimensionalWithDefault(step.duration, inputDefault.duration),
          read    : _.result(step, 'read', false)
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
};


converterField.thermocycleDyes = function (input) {
  var filtered = _.filter(input, function (item) {
    return _.result(item, 'wells', []).length;
  });
  //todo -verify a dye was selected, or use defualt. currently view is reponsible for guarantee
  var zipped = _.zipObject(_.pluck(filtered, 'dye'), _.pluck(filtered, 'wells'));
  if (_.keys(zipped).length == 0) {
    return null;
  }
  return zipped;
};

converterField.thermocycleMelting = function (input, fieldObj) {
  var fields = ['start', 'end', 'increment', 'rate'];
  return mapSomeDimensionalFields(input, _.result(fieldObj, 'default'), fields);
};


converterField.mixwrap = function (input, fieldObj) {
  return mapSomeDimensionalFields(input, _.result(fieldObj, 'default'), ['speed', 'volume'], ['repetitions']);
};

converterField.resource = function (input, fieldObj) {
  return _.result(input, 'id');
};

/*******************
 Instruction Conversion
 *******************/

//todo - following refactor of OmniConv, update all these to pass in the operation rather than just fields so indices can be propagated

function simpleMapOperation (op, localParams) {
  return _.assign({
    op: op.operation
  }, omniConv.simpleKeyvalFields(op, localParams, converterField));
}

//takes an autoprotocol instruction(s), wraps in pipette group
function wrapInPipette (instruction) {
  return {
    op    : "pipette",
    groups: _.isArray(instruction) ? instruction : [instruction]
  };
}

converterInstruction.cover   = simpleMapOperation;
converterInstruction.uncover = simpleMapOperation;
converterInstruction.seal    = simpleMapOperation;
converterInstruction.unseal  = simpleMapOperation;

/* SPECTROMETRY */

converterInstruction.fluorescence = _.flow(simpleMapOperation,
  _.partial(autoUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));
converterInstruction.luminescence = _.flow(simpleMapOperation,
  _.partial(autoUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));
converterInstruction.absorbance   = _.flow(simpleMapOperation,
  _.partial(autoUtils.pluckOperationContainerFromWells, _, 'object', 'wells'));

/* LIQUID HANDLING */

converterInstruction.transfer = function (op) {

  var fromWells      = omniConv.pluckFieldValueTransformed(op, 'from', converterField),
      toWells        = omniConv.pluckFieldValueTransformed(op, 'to', converterField),
      volume         = omniConv.pluckFieldValueTransformed(op, 'volume', converterField),
      optionalFields = ['dispense_speed', 'aspirate_speed', 'mix_before', 'mix_after'],
      optionalObj    = omniConv.getFieldsIfSet(op, optionalFields, true, converterField),
      transfers      = [];

  //todo - eventually, fold the pipette operations into one, and delegate based on 1-n, n-1, n-n
  if (fromWells.length != toWells.length) {

    if (fromWells.length == 1) {
      _.fill(fromWells, fromWells[0], 0, toWells.length);
    } else {
      console.warn('transfer wells dont match up', toWells, fromWells);
      throwFieldError('transfer wells dont match up', op, 'to');
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
        transfer: [xfer]
      };
    });
  }

  return wrapInPipette(xfers);
};

converterInstruction.consolidate = function (op) {
  var fromWells          = omniConv.pluckFieldValueTransformed(op, 'from', converterField),
      toWell             = omniConv.pluckFieldValueTransformed(op, 'to', converterField),
      volume             = omniConv.pluckFieldValueTransformed(op, 'volume', converterField),
      optionalFromFields = ['aspirate_speed'],
      optionalAllFields  = ['dispense_speed', 'mix_after'],
      optionalFromObj    = omniConv.getFieldsIfSet(op, optionalFromFields, true, converterField),
      optionalAllObj     = omniConv.getFieldsIfSet(op, optionalAllFields, true, converterField),
      fromArray          = [];

  _.forEach(fromWells, function (fromWell) {
    fromArray.push(_.assign({
      volume: volume,
      well  : fromWell
    }, optionalFromObj))
  });

  var consolidates = _.assign({
    to  : toWell,
    from: fromArray
  }, optionalAllObj);

  return wrapInPipette({consolidate: consolidates});
};

converterInstruction.distribute = function (op) {
  var fromWell          = omniConv.pluckFieldValueTransformed(op, 'from', converterField),
      toWells           = omniConv.pluckFieldValueTransformed(op, 'to', converterField),
      volume            = omniConv.pluckFieldValueTransformed(op, 'volume', converterField),
      optionalToFields  = ['dispense_speed'],
      optionalAllFields = ['aspirate_speed', 'mix_before'],
      optionalToObj     = omniConv.getFieldsIfSet(op, optionalToFields, true, converterField),
      optionalAllObj    = omniConv.getFieldsIfSet(op, optionalAllFields, true, converterField),
      toArray           = [];

  _.forEach(toWells, function (fromWell) {
    toArray.push(_.assign({
      volume: volume,
      well  : fromWell
    }, optionalToObj))
  });

  var distributes = _.assign({
    from: fromWell,
    to  : toArray
  }, optionalAllObj);

  return wrapInPipette({distribute: distributes});
};

converterInstruction.mix = function (op) {
  var wells          = omniConv.pluckFieldValueTransformed(op, 'wells', converterField),
      volume         = omniConv.pluckFieldValueTransformed(op, 'volume', converterField),
      repetitions    = omniConv.pluckFieldValueTransformed(op, 'repetitions', converterField),
      optionalFields = ['speed'],
      optionalObj    = omniConv.getFieldsIfSet(op, optionalFields, true, converterField);

  var mixes = _.map(wells, function (well) {
    return _.assign({
      well       : well,
      volume     : volume,
      repetitions: repetitions
    }, optionalObj);
  });

  var mixesSplit;
  if (omniUtils.pluckFieldValueRaw(op.fields, 'one_tip') === true) {
    mixesSplit = {mix: mixes};
  } else {
    mixesSplit = _.map(mixes, function (mix) {
      return {
        mix: [mix]
      };
    });
  }

  return wrapInPipette(mixesSplit);
};

converterInstruction.dispense = simpleMapOperation;

converterInstruction.provision = function (op) {
  var wells      = omniConv.pluckFieldValueTransformed(op, 'wells', converterField),
      volume     = omniConv.pluckFieldValueTransformed(op, 'volume', converterField),
      resourceId = _.result(omniUtils.pluckFieldValueRaw(op.fields, 'resource'), 'id');

  if (!resourceId) {
    throwFieldError('missing resource id', op, 'id');
  }

  return {
    op         : 'provision',
    resource_id: resourceId,
    to         : _.map(wells, function (well) {
      return {
        well  : well,
        volume: volume
      };
    })
  };
};

converterInstruction.spread = simpleMapOperation;

converterInstruction.autopick = simpleMapOperation;

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

converterInstruction.image_plate = simpleMapOperation;

/* SPECIAL */

converterInstruction.autoprotocol = function (op) {
  var jsonString = omniUtils.pluckFieldValueRaw(op.fields, 'json');
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    throwFieldError('JSON was invalid', op, 'json');
  }
};

module.exports = {
  field      : converterField,
  instruction: converterInstruction
};