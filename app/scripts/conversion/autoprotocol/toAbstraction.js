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