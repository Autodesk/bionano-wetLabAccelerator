'use strict';

/**
 * @ngdoc factory
 * @name transcripticApp.autoprotocol
 * @description
 * Service converting between abstraction and autoprotocol
 * todo - rename this service
 */
angular.module('transcripticApp')
  .service('Autoprotocol', function (ConvAutoprotocolInstruction, ConversionUtils, AbstractionUtils) {

    function convertInstruction (inst, localParams) {
      //todo - handle validation of each field too?

      var converter = ConvAutoprotocolInstruction[inst.operation];

      if (!_.isFunction(converter)) {
        console.error('converter doesn\'t exist for ' + inst.operation);
        return null;
      }

      return converter(inst, localParams);
    }

    //returns an array of auto_instructions for the abst_group
    function unwrapGroup (group) {
      var unwrapped = [];

      _.times(group.loop || 1, function (loopIndex) {
        _.forEach(group.steps, function (step, stepIndex) {
          //var stepIndex = (loopIndex * group.steps.length) + stepIndex;
          unwrapped.push(convertInstruction(step, {index : loopIndex}));
        });
      });
      return unwrapped;
    }

    function makeReference (ref) {
      var obj = {};
      var internal = {};

      if (!!ref.isNew || _.isUndefined(ref.id)) {
        _.assign(internal, {type: ref.type});
      } else {
        _.assign(internal, {id: ref.id});
      }

      if (!!ref.storage) {
        internal.store = {
          where : ref.storage
        };
      } else {
        internal.discard = true;
      }

      obj[ref.name] = internal;
      return obj;
    }

    //convert abstraction to autoprotocol
    function fromAbstraction (abst) {
      var references = {};
      _.forEach(abst.references, function (abstRef) {
        _.assign(references, makeReference(abstRef));
      });

      //each group gives an array, need to concat (_.flatten)
      var instructions = _.flatten(_.map(abst.groups, unwrapGroup));

      //console.log('interpolating everything');

      var paramKeyvals = _.zipObject(
        _.pluck(abst.parameters, 'name'),
        _.pluck(abst.parameters, 'value')
      );

      var interpolatedInstructions = AbstractionUtils.interpolateObject(instructions, paramKeyvals);

      return {
        refs : references,
        instructions : interpolatedInstructions
      };
    }

    //convert autoprotocol to abstraction
    function toAbstraction (auto) {

    }

    //basic check to see if json looks to be an abstraction
    function isAbstraction (json) {

    }

    return {
      fromAbstraction : fromAbstraction,
      toAbstraction : toAbstraction,
      isAbstraction : isAbstraction
    }
  });
