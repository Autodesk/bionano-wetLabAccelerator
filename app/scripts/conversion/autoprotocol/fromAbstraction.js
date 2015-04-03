'use strict';

//todo - in future, support conversion to packages, not just protocols

var _         = require('lodash'),
    autoUtils = require('./utils.js'),
    op        = global.omniprotocol,
    omniUtils = op.utils;

//convert abstraction to autoprotocol
function fromAbstraction (abst) {
  var references = {};
  _.forEach(abst.references, function (abstRef) {
    _.assign(references, autoUtils.makeReference(abstRef));
  });

  //each group gives an array, need to concat (_.flatten)
  var instructions = _.flatten(_.map(abst.groups, autoUtils.unwrapGroup));

  //console.log('interpolating everything');

  var paramKeyvals = _.zipObject(
      _.pluck(abst.parameters, 'name'),
      _.pluck(abst.parameters, 'value')
  );

  var interpolatedInstructions = omniUtils.interpolateObject(instructions, paramKeyvals);

  return {
    refs        : references,
    instructions: interpolatedInstructions
  };
}

module.exports = fromAbstraction;