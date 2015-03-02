'use strict';

/**
 * @ngdoc factory
 * @name transcripticApp.autoprotocol
 * @description
 * Service converting between abstraction and
 */
angular.module('transcripticApp')
  .service('Autoprotocol', function (AutoprotocolInstruction) {

    function convertInstruction (inst, params) {
      //todo - handle validation of each field too?

      var converter = AutoprotocolInstruction[inst.operation];

      if (!_.isFunction(converter)) {
        console.log('converter doesn\'t exist for ' + inst.operation);
        return null;
      }

      return converter(inst, params);
    }

    //returns an array of instructions for the group
    function unwrapGroup (group, params) {
      var unwrapped = [];

      _.times(group.loop || 1, function (loopIndex) {
        _.forEach(group.steps, function (step, stepIndex) {
          //var stepIndex = (loopIndex * group.steps.length) + stepIndex;
          var extendedParams = _.assign({index : loopIndex}, params);
          unwrapped.push(convertInstruction(step, extendedParams));
        });
      });
      return unwrapped;
    }


    //todo - would be great if this could recursively handle objects, and just post-process the protocol afterwars, that way we only need to interpolate ${index} and everything can be done afterwards. requires the template function will only interpolate ${index} and leave everything else intact. Then don;t need to pass params down through each function.
    function interpolateValue (value, params) {
      return _.template(value)(params);
    }

    function interpolateObject(obj, params) {
      //todo
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

      //each group gives an array, need to concat later (_.flatten)
      var instructions = _.map(abst.groups, _.partialRight(unwrapGroup, abst.parameters) );

      // todo - post-process - object wide interpolation

      return {
        refs : references,
        instructions : _.flatten(instructions)
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
