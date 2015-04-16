var _                     = require('lodash'),
    utils                 = require('./utils.js'),
    omniprotocol          = global.omniprotocol,
    fieldConverters       = {},
    instructionConverters = {};

/******************
 Field Utils
 ******************/

var dimensionalSeparator = ':';

function handleDimensional (dimObj) {
  var split = dimObj.split(dimensionalSeparator);
  return {
    value: split[0],
    unit : split[1]
  }
}

var dimensionalTypes = _.keys(_.pick(omniprotocol.inputTypes, _.matches({'autoprotocol-type': "Unit"})));

/*** dimensional fields ***/

instructionConverters['dimensional'] = _.identity;
_.forEach(dimensionalTypes, function (type) {
  instructionConverters[type] = _.identity;
});

_.assign(instructionConverters, {
  generic: _.identity,

  /*** primitives ***/

  integer: _.identity,
  decimal: _.identity,
  boolean: _.identity,
  string : _.identity,
  option : _.identity,

  /*** containers ***/

  //todo - handle distinguishing between specifying container or not
  aliquot    : function (autoval) {
    return [utils.splitContainerWell(autoval)];
  },
  'aliquot+' : _.partial(_.map, _, utils.splitContainerWell),
  'aliquot++': _.flow(_.map, _.partial(_.map, _, utils.splitContainerWell)), //note - not used in omni
  container  : _.identity,
  group      : _.identity,
  'group+'   : _.identity,

  /*** custom field types ***/

  thermocycleGroup  : function (autoval) {
    return _.map(autoval, function (autogroup) {
      return {
        cycles: _.result(autogroup, 'cycles', 1),
        steps : _.map(_.result(autogroup, 'steps', []), function (autostep) {
          var omnistep = {
            duration  : _.result(autostep, 'duration'),
            read      : _.result(autostep, 'read', false),
            isGradient: _.has(autostep, 'gradient')
          };

          if (omnistep.isGradient) {
            _.assign(omnistep, {
              gradientStart: _.result(autostep.gradient, 'top'),
              gradientEnd  : _.result(autostep.gradient, 'bottom')
            });
          } else {
            _.assign(omnistep, {
              temperature: _.result(autostep, 'temperature')
            });
          }

          return omnistep;
        })
      };
    });
  },
  thermocycleMelting: _.identity,
  thermocycleDyes   : function (autoval) {
    return _.map(autoval, function (wells, dye) {
      return {
        dye  : dye,
        wells: wells
      }
    });
  },
  columnVolumes     : _.identity,
  mixwrap           : _.identity
});

/******************
 Field Converters
 ******************/

function convertFieldValue (fieldType, autoVal, fieldName, op) {

  var converter = _.has(fieldConverters, fieldType) ?
      fieldConverters[fieldType] :
      _.identity; //todo - error when undefined

  return converter(autoVal, fieldName, op);
}

/******************
 Instruction Utils
 ******************/

/* e.g. given fieldObj { duration : "duration" } for op { duration : {"value" : 60, "unit" : "seconds" } } generate
 * { name : "duration", type: "duration" , value : {"value" : 60, "unit" : "seconds" } }
 */
function basicFieldConvert (op, fieldObj) {
  return _.map(fieldObj, function (fieldType, fieldName) {

    var fieldVal = _.result(op, fieldName, null);
    _.isNull(fieldVal) && console.warn('field ' + fieldName + ' undefined:', op);

    return {
      name : fieldName,
      type : fieldType,
      value: fieldVal
    };
  });
}

//fieldMap can either can an object, which just maps fields directly by name, or an object whose keys are autoprotocol
// field names, and values are omniprotocol field names
function populateOperationScaffold (op, fieldMap) {
  var opName            = _.result(op, 'op'),
      fieldsToRetrieve  = _.isArray(fieldMap) ? fieldMap : _.keys(fieldMap),
      //use _.map to ensure order matches
      fieldsToSet       = _.isArray(fieldMap) ? fieldMap : _.map(fieldsToRetrieve, _.partial(_.result, fieldMap)),
      initValues        = _.map(fieldsToRetrieve, _.partial(_.result, op)),
      fieldTypes        = _.map(fieldsToSet, _.partial(omniprotocol.utils.getFieldTypeInOperation, opName)),
      transformedValues = _.map(initValues, function (autoval, index) {
        return convertFieldValue(fieldTypes[index], autoval, fieldsToRetrieve[index], op);
      }),
      fieldObj          = _.zipObject(fieldsToSet, transformedValues);

  omniprotocol.utils.scaffoldOperationWithValues(opName, fieldObj);
}

function directMapFieldsToScaffold (op) {
  var remaining  = _.omit(op, 'op'),
      fieldNames = _.keys(remaining);

  return populateOperationScaffold(op, fieldNames);
}

function getPipetteGroupOps (instruction, type) {
  return _.result(instruction, type, []);
}

/******************
 Instruction Converters
 ******************/

_.assign(instructionConverters, {
  generic    : directMapFieldsToScaffold,

  //todo - smarter liquid handling steps.. these are barebones
  //for now, just getting first one in a bunch and assuming they will be same throughout

  transfer   : function (instruction) {

  },
  distribute : function (instruction) {

  },
  consolidate: function (instruction) {

  },
  mix        : function (instruction) {

  }
});

_.forEach([
  'spin',
  'seal',
  'unseal',
  'cover',
  'uncover',
  'store',
  'discard',
  'luminescence',
  'fluorescence',
  'absorbance',
  'gel_separate',
  'incubate',
  'thermocycle',
  'dispense '], function (instruction) {
  instructionConverters[instruction] = directMapFieldsToScaffold;
});

module.exports = {
  fields      : fieldConverters,
  instructions: instructionConverters
};