'use strict';

//todo - in future, support conversion to packages, not just protocols

var _         = require('lodash'),
    fromUtils = require('./fromUtils.js'),
    op        = require('omniprotocol'),
    omniUtils = op.utils;

//convert abstraction to autoprotocol
function fromAbstraction (abst) {

  var references = {};

  _.forEach(_.filter(abst.parameters, _.matches({type: 'container'})), function (abstRef) {
    _.assign(references, fromUtils.makeReference(abstRef));
  });

  //each group gives an array, need to concat (_.flatten)
  var instructions = _.flatten(_.map(abst.groups, fromUtils.unwrapGroup));

  //todo - handle interpolation of containers properly
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