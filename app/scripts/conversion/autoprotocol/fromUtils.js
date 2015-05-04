var _                    = require('lodash'),
    fromConverters       = require('./fromConverters.js'),
    utils                = require('./utils.js'),
    converterField       = fromConverters.field,
    converterInstruction = fromConverters.instruction,
    op                   = require('omniprotocol'),
    omniConv             = op.conv;

function convertInstruction (inst, localParams) {
  //todo - handle validation of each field too?

  var converter = converterInstruction[inst.operation];

  if (!_.isFunction(converter)) {
    console.error('converter doesn\'t exist for ' + inst.operation);
    return null;
  }

  _.assign(localParams, {
    operation: inst.operation
  });

  return converter(inst, localParams);
}

// todo - would be great to abstract this out of requiring conversion inline
// need to handle way of defining dictionary per step, so that loop index doesn't need to be fed directly to function,
// but can be part of data object instead
function unwrapGroup (group) {
  var unwrapped = [];

  _.times(group.loop || 1, function (loopIndex) {
    _.forEach(group.steps, function (step, stepIndex) {
      var stepCalc = (loopIndex * group.steps.length) + stepIndex;
      unwrapped.push(convertInstruction(step, {
        index: loopIndex,
        step : stepCalc
      }));
    });
  });
  return unwrapped;
}

function makeReference (ref) {
  var obj      = {},
      internal = {};

  if (_.isUndefined(ref.type) || ref.type != 'container' || _.isUndefined(ref.value)) {
    throw Error('invalid reference', ref);
  }

  if (!!ref.value.isNew || _.isUndefined(ref.value.id)) {
    _.assign(internal, {new: ref.value.type});
  } else {
    _.assign(internal, {id: ref.value.id});
  }

  if (!!ref.value.storage) {
    internal.store = {
      where: ref.value.storage
    };
  } else {
    internal.discard = true;
  }

  obj[ref.name] = internal;
  return obj;
}

module.exports = {
  convertInstruction: convertInstruction,
  unwrapGroup       : unwrapGroup,
  makeReference     : makeReference
};