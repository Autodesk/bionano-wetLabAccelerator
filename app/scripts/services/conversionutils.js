'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ConversionUtils
 * @description
 * # ConversionUtils
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ConversionUtils', function (InputTypes, AbstractionUtils) {

    var self = this;

    /*******
     Field Selection + Conversion
     ******/

    self.pluckField = function pluckField (fields, fieldName) {
      return _.find(fields, {name : fieldName});
    };

    //given a field object (with type and value), convert the value using the method 'converterKey' or default to 'toAutoprotocol'
    self.transformField = function transformField (fieldObj, converterKey) {
      var fieldVal = _.result(fieldObj, 'value'),
          fieldType = _.result(fieldObj, 'type'),
          inputTypeObj = _.result(InputTypes, fieldType),
          convertKey = _.isUndefined(converterKey) ? 'toAutoprotocol' : converterKey,
          //don't use _.result here or executes the function
          converter = inputTypeObj[convertKey];

      if (!_.isFunction(converter)) {
        throw new Error('field type is invalid:', fieldObj.type, fieldObj);
      }

      return converter(fieldVal);
    };

    //get the raw field value. Only use if going to handle transformation later.
    self.pluckFieldValueRaw = function pluckFieldValueRaw (fields, fieldName) {
      return _.result(self.pluckField(fields, fieldName), 'value');
    };

    //get field value, and run through converterKey (default 'toAutoprotocol')
    self.pluckFieldValueTransformed = function pluckFieldValueTransformed (fields, fieldName, converterKey) {
      var field = self.pluckField(fields, fieldName);
      return self.transformField(field, converterKey);
    };

    //todo - what is desired default behavior for using default value?
    //Given list of fields, and array of desired field keys, returns object where desired key is present only if value is defined, or uses default value if allowDefault is defined
    self.getFieldsIfSet = function getOptionalFields (fields, desired, allowDefault, converterKey) {
      var obj = {};
      _.forEach(desired, function (desiredKey) {
        var field = self.pluckField(fields, desiredKey),
            fieldVal = self.transformField(field, converterKey),
            fieldDefault = _.result(field, 'default');

        if (fieldVal) {
          obj[desiredKey] = fieldVal;
        } else if ( !!allowDefault && !_.isEmpty(fieldDefault) ){
          obj[desiredKey] = fieldDefault;
        }
      });
      return obj;
    };

    /*******
     Iteration
     ******/

    //given array of abstraction fields, convert to keyvals where field.name is key and field.value is value. Does not handle interpolation.
    self.simpleKeyvalFields = function (fields, localParams) {
      var obj = {};
      _.forEach(fields, function (field) {
        var transformed = self.transformField(field);
        if (_.isObject(localParams) && !_.isEmpty(localParams)) {
          transformed = AbstractionUtils.interpolateObject(transformed, localParams);
        }
        obj[field.name] = transformed;
      });
      return obj;
    };

    //simply maps an operation and fields directly to keys and values
    self.simpleMapOperation = function (op, localParams) {
      return _.assign({
        op : op.operation
      }, self.simpleKeyvalFields(op.fields, localParams));
    };

    /*******
     Wrapping
     ******/

    //takes an autoprotocol instruction, wraps in pipette group
    self.wrapInPipette = function (instruction) {
      return {
        op: "pipette",
        groups: [instruction]
      };
    };

  });
