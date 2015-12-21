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
    throw new ConversionError('converter doesn\'t exist for ' + inst.operation, null, null, inst.$index);
  }

  return converter(inst, localParams);
}

//todo - pass error information to tie back to parameters
function makeReference (ref, index) {
  var obj      = {},
      internal = {};

  if (_.isUndefined(ref.name) || !_.has(ref, 'value.type')) {
    throw new ConversionError('Reference must have a name, type, and storage', ref, ref.name, 'parameter');
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

  /*
  //deal with unnamed containers, changing the name of it itself
  //todo - how to update the protocol?
  if (!ref.name) {
    ref.name = 'container_' + Math.floor(Math.random() * 1000);
  }
  */

  obj[ref.name] = internal;
  return obj;
}

module.exports = {
  convertInstruction: convertInstruction,
  makeReference     : makeReference
};