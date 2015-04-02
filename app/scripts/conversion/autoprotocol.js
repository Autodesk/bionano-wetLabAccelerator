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

  /*******************
   Field Conversion
   *******************/

    //only include special conversions, otherwise just use value (_.identity)

  converterField.aliquot = _.flow(utils.flattenAliquots, _.first);

  converterField['aliquot+'] = utils.flattenAliquots;

  converterField.columnVolumes = function (input) {
    return _.map(input, function (colVol) {
      return {
        column: colVol.column,
        volume: colVol.volume
      };
    });
  };

  converterField.thermocycleGroup = function (input) {
    return _.map(input, function (group) {
      return {
        cycles: group.cycles,
        steps : _.map(group.steps, function (step) {
          return _.assign({
                duration: step.duration,
                read    : _.result(step, 'read', true)
              }, (step.isGradient ?
                {
                  gradient: {
                    top: step.gradientStart,
                    end: step.gradientEnd
                  }
                } :
                {
                  temperature: step.temperature
                }
              )
          );
        })
      };
    });
  };

  converterField.thermocycleDyes = function (input) {
    return _.zipObject(
        _.pluck(input, 'dye'),
        input.wells
    );
  };

  /*******************
   Instruction Conversion
   *******************/

  converterInstruction.cover = simpleMapOperation;
  converterInstruction.uncover = simpleMapOperation;
  converterInstruction.seal = simpleMapOperation;
  converterInstruction.unseal = simpleMapOperation;

  /* SPECTROMETRY */

  converterInstruction.fluorescence = _.flow(simpleMapOperation,
      _.partial(conv.pluckOperationContainerFromWells, _, 'object', 'wells'));
  converterInstruction.luminescence = _.flow(simpleMapOperation,
      _.partial(conv.pluckOperationContainerFromWells, _, 'object', 'wells'));
  converterInstruction.absorbance = _.flow(simpleMapOperation,
      _.partial(conv.pluckOperationContainerFromWells, _, 'object', 'wells'));

  /* LIQUID HANDLING */

  converterInstruction.transfer = function (op) {

    var fromWells      = utils.flattenAliquots(utils.pluckFieldValueRaw(op.fields, 'from')),
        toWells        = utils.flattenAliquots(utils.pluckFieldValueRaw(op.fields, 'to')),
        volume         = conv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
        optionalFields = ['dispense_speed', 'aspirate_speed', 'mix_before', 'mix_after'],
        optionalObj    = conv.getFieldsIfSet(op.fields, optionalFields),
        transfers      = [];

    //todo - eventually, we want to put some of this in 'requirements' for the operation (pending them all written to
    // know what is consistent)
    if (fromWells.length != toWells.length) {

      if (fromWells.length == 1) {
        _.fill(fromWells, fromWells[0], 0, toWells.length);
      } else {
        console.warn('transfer wells dont match up', toWells, fromWells);
        throw new Error('transfer wells dont match up');
      }
    }

    //assuming that to_wells is always greater than from_wells
    _.forEach(toWells, function (toWell, index) {
      transfers.push(_.assign({
        volume: volume,
        to    : toWell,
        from  : fromWells[index]
      }, optionalObj));
    });

    return wrapInPipette({transfer: transfers});
  };

  converterInstruction.consolidate = function (op) {
    var fromWells          = utils.flattenAliquots(utils.pluckFieldValueRaw(op.fields, 'from')),
        toWell             = conv.pluckFieldValueTransformed(op.fields, 'to', converterField),
        volume             = conv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
        optionalFromFields = ['aspirate_speed'],
        optionalAllFields  = ['dispense_speed', 'mix_after'],
        optionalFromObj    = conv.getFieldsIfSet(op.fields, optionalFromFields),
        optionalAllObj     = conv.getFieldsIfSet(op.fields, optionalAllFields),
        fromArray          = [];

    _.forEach(fromWells, function (fromWell) {
      fromArray.push(_.assign({
        volume: volume,
        from  : fromWell
      }, optionalFromObj))
    });

    return _.assign({
      to  : toWell,
      from: fromArray
    }, optionalAllFields);
  };

  converterInstruction.distribute = function (op) {
    //todo - pass converters to transformer
    var fromWell          = conv.pluckFieldValueTransformed(op.fields, 'from', converterField),
        toWells           = utils.flattenAliquots(utils.pluckFieldValueRaw(op.fields, 'to')),
        volume            = conv.pluckFieldValueTransformed(op.fields, 'volume', converterField),
        optionalToFields  = ['dispense_speed'],
        optionalAllFields = ['aspirate_speed', 'mix_before'],
        optionalToObj     = conv.getFieldsIfSet(op.fields, optionalToFields),
        optionalAllObj    = conv.getFieldsIfSet(op.fields, optionalAllFields),
        toArray           = [];

    _.forEach(toWells, function (fromWell) {
      toArray.push(_.assign({
        volume: volume,
        to    : fromWell
      }, optionalToObj))
    });

    return _.assign({
      from: fromWell,
      to  : toArray
    }, optionalAllFields);
  };

  converterInstruction.mix = function (op) {
    var wells          = conv.pluckFieldValueTransformed(op.fields, 'wells', converterField),
        optionalFields = ['repetitions', 'volume', 'speed'],
        optionalObj    = conv.getFieldsIfSet(op.fields, optionalFields, true);

    return _.map(wells, function (well) {
      return _.assign({
        well: well
      }, optionalObj);
    });
  };

  converterInstruction.dispense = function (op) {
    var volumesValue = conv.pluckFieldValueRaw(op.fields, 'columns'),
        container    = _.result(_.first(volumesValue), 'container'),
        mapped       = simpleMapOperation(op);

    return _.assign(mapped, {object: container});
  };

  /* TEMPERATURE */

  converterInstruction.incubate = simpleMapOperation;


  converterInstruction.thermocycle = simpleMapOperation;

  /* DNA */

  /*
   convertInstruction.sangerseq = function (op) {};
   */

  converterInstruction.gel_separate = simpleMapOperation;

  /* CONTAINER HANDLING */

  converterInstruction.store = simpleMapOperation;
  converterInstruction.discard = simpleMapOperation;


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