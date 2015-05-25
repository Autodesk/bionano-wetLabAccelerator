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