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

'use strict';

//todo - in future, support conversion to packages, not just protocols

var _         = require('lodash'),
    fromUtils = require('./fromUtils.js'),
    op        = global.omniprotocol,
    omniUtils = op.utils;

//convert abstraction to autoprotocol
function fromAbstraction (abst) {

  var references = {};

  _.forEach(_.filter(abst.parameters, _.matches({type: 'container'})), function (abstRef) {
    _.assign(references, fromUtils.makeReference(abstRef));
  });

  var instructions = _(omniUtils.unfoldProtocol(abst))
    .map(function (operation) {
      var dictionary = _.assign({}, operation.$index, {operation: operation.operation});

      //this function will error with a ConversionError (see omniConv) which should be caught upstream, and use indices to tie to protocol. Use error.$index with keys group, loop, step, unfolded
      var converted = fromUtils.convertInstruction(operation);

      var interpolated = omniUtils.interpolateObject(converted, dictionary);
      console.log(dictionary, converted, interpolated);
      return interpolated;
    })
    .value();

  return {
    refs        : references,
    instructions: instructions
  };
}

module.exports = fromAbstraction;