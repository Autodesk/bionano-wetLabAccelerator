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

var _            = require('lodash'),
    omniprotocol = global.omniprotocol,
    omniUtils    = omniprotocol.utils,
    toConverters = require('./toConverters.js'),
    toUtils      = require('./toUtils.js');

function toAbstraction (auto) {

  var references   = toUtils.convertReferences(auto.refs);
  var instructions = toUtils.convertInstructions(auto.instructions);

  var omni        = omniUtils.wrapGroupsInProtocol(instructions);
  omni.parameters = references;

  //todo - further post-processing
  // well numbers to alphanumerics
  // moving to variables --- but also accomodating packages, not just protocols
  // look for looping

  var postprocess = _.flow(toUtils.convertWellsToAlphanums);

  return postprocess(omni);
}

module.exports = toAbstraction;