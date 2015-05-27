var _                    = require('lodash'),
    fromConverters       = require('./fromConverters.js'),
    utils                = require('./utils.js'),
    converterField       = fromConverters.field,
    converterInstruction = fromConverters.instruction,
    omniContainers       = global.omniprotocol.optionEnums.containers,
    omniConv             = global.omniprotocol.conv;

function convertInstruction (inst, localParams) {
  //todo - handle validation of each field too?

  var converter = converterInstruction[inst.operation];

  if (!_.isFunction(converter)) {
    console.error('converter doesn\'t exist for ' + inst.operation);
    return null;
  }

  return converter(inst, localParams);
}

//todo - pass error information to tie back to parameters
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

  //hack - special handling for reservations, which currently is only the 6-well pre-poured plate (5/20)
  var resId = !internal.id && _.result(_.result(omniContainers, ref.value.type), 'reservation');
  if (resId) {
    delete internal.new;
    delete internal.id;
    internal.reserve = resId
  }

  obj[ref.name] = internal;
  return obj;
}

module.exports = {
  convertInstruction: convertInstruction,
  makeReference     : makeReference
};