(function (window, document, _, undefined) {
  'use strict';

  //initial checks

  if (typeof _ == 'undefined') {
    console.error('must include lodash');
    return;
  }

  var op                   = window.omniprotocol,
      utils                = op.utils,
      conv                 = op.conv,
      ap                   = op.autoprotocol || (op.autoprotocol = {}),
      converterInstruction = {},
      converterField       = {};


  /******************
   Utilities
   ******************/

  //takes an autoprotocol instruction, wraps in pipette group
  function wrapInPipette (instruction) {
    return {
      op    : "pipette",
      groups: [instruction]
    };
  }

  function simpleMapOperation (op, localParams) {
    return _.assign({
      op: op.operation
    }, conv.simpleKeyvalFields(op.fields, localParams, converterField));
  }


  /****************
   Higher level stuff
   *****************/


  function convertInstruction (inst, localParams) {
    //todo - handle validation of each field too?

    var converter = converterInstruction[inst.operation];

    if (!_.isFunction(converter)) {
      console.error('converter doesn\'t exist for ' + inst.operation);
      return null;
    }

    return converter(inst, localParams);
  }

  //todo - abstract to general utils
  //returns an array of auto_instructions for the abst_group
  function unwrapGroup (group) {
    var unwrapped = [];

    _.times(group.loop || 1, function (loopIndex) {
      _.forEach(group.steps, function (step, stepIndex) {
        //var stepIndex = (loopIndex * group.steps.length) + stepIndex;
        unwrapped.push(convertInstruction(step, {index: loopIndex}));
      });
    });
    return unwrapped;
  }

  function makeReference (ref) {
    var obj = {};
    var internal = {};

    if (!!ref.isNew || _.isUndefined(ref.id)) {
      _.assign(internal, {new: ref.type});
    } else {
      _.assign(internal, {id: ref.id});
    }

    if (!!ref.storage) {
      internal.store = {
        where: ref.storage
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

    var interpolatedInstructions = utils.interpolateObject(instructions, paramKeyvals);

    return {
      refs        : references,
      instructions: interpolatedInstructions
    };
  }

  //convert autoprotocol to abstraction
  function toAbstraction (auto) {

  }

  /*****************
   Expose API
   *****************/

  if (window.omniprotocol.autoprotocol.fromAbstraction) {
    console.warn('already added the autoprotocol module');
  } else {
    _.extend(ap, {
      fromAbstraction: fromAbstraction,
      toAbstraction  : toAbstraction,
      converters     : {
        field      : converterField,
        instruction: converterInstruction
      },
      util           : {
        convertInstruction: convertInstruction
      }
    });
  }

})(window, document, _);