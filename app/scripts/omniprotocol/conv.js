'use strict';

var _      = require('lodash'),
    utils  = require('./utils.js'),
    inputs = require('./inputTypes.js');

/*******
 Field Selection + Conversion
 ******/

function ConversionError(message, fieldObj, fieldName, indices) {
  this.name = 'ConversionError';
  this.message = message || 'Default Message';
  this.field = fieldObj;
  this.fieldName = fieldName;
  this.$index = indices;
}
ConversionError.prototype = Object.create(Error.prototype);
ConversionError.prototype.constructor = ConversionError;

global.ConversionError = ConversionError;

//given a field object (with type and value), and an map of converters with keys of fieldType, transform a field, or just return the value
//if allowDefault is false, do not allow using default if value is undefined
function transformField (fieldObj, fieldConverters, allowDefault, indices) {
  var fieldVal  = _.result(fieldObj, 'value'),
      fieldType = _.result(fieldObj, 'type'),
      converter = _.has(fieldConverters, fieldType) ? fieldConverters[fieldType] : _.identity;

  if (_.isUndefined(fieldVal)) {
    if (fieldObj.optional) {
      return null;
    } else {
      if (_.has(fieldObj, 'default') && allowDefault !== false) {
        console.log('using default for field ' + fieldObj.name, fieldObj);
        fieldVal = _.result(fieldObj, 'default');
      } else {
        throw new ConversionError('missing value for non-optional field ' + fieldObj.name, fieldObj, fieldObj.name, indices);
      }
    }
  }

  if (!_.isFunction(converter)) {
    throw new ConversionError('converter is invalid for field type ' + fieldObj.type, fieldObj, fieldObj.name, indices);
  }

  return converter(fieldVal, fieldObj);
}

//get field value, and run through converterKey (default 'toAutoprotocol')
function pluckFieldValueTransformed (op, fieldName, fieldConverters) {
  var field = utils.pluckField(op.fields, fieldName);
  return transformField(field, fieldConverters, true, op.$index);
}

//Given list of fields, and array of desired field keys, returns object where desired key is present only if value is
// defined, or uses default value if allowDefault is defined
function getFieldsIfSet (op, desired, allowDefault, fieldConverters) {
  var obj = {};
  _.forEach(desired, function (desiredKey) {
    var field        = utils.pluckField(op.fields, desiredKey),
        transformed = transformField(field, fieldConverters, allowDefault, op.$index);

    if (!_.isNull(transformed)) {
      obj[desiredKey] = transformed;
    }
  });
  return obj;
}

/*******
 Iteration
 ******/

//given array of abstraction fields, convert to keyvals where field.name is key and field.value is value. Does not
// handle interpolation.
//todo - refactor so localParams comes later in arguments
function simpleKeyvalFields (op, localParams, fieldConverters, allowDefault) {
  var obj = {};
  _.forEach(op.fields, function (field) {
    var transformed = transformField(field, fieldConverters, allowDefault, op.$index);

    //if transformField returns null, field was undefined and optional, so skip it
    if (_.isNull(transformed)) {
      return;
    }

    if (_.isObject(localParams) && !_.isEmpty(localParams)) {
      transformed = utils.interpolateObject(transformed, localParams);
    }
    obj[field.name] = transformed;
  });
  return obj;
}

module.exports = {
  transformField            : transformField,
  pluckFieldValueTransformed: pluckFieldValueTransformed,
  getFieldsIfSet            : getFieldsIfSet,
  simpleKeyvalFields        : simpleKeyvalFields
};
