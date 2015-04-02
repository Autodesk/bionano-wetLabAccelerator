(function (window, document, _, undefined) {
  'use strict';

  //initial checks

  if (typeof _ == 'undefined') {
    console.error('must include lodash');
    return;
  }

  var op     = window.omniprotocol,
      conv   = op.conv || (op.conv = {}),
      utils  = op.utils,
      inputs = op.inputTypes;

  /*******
   Field Selection + Conversion
   ******/

  //given a field object (with type and value), and an map of converters with keys of fieldType, transform a field, or
  // just return the value
  function transformField (fieldObj, fieldConverters) {
    var fieldVal  = _.result(fieldObj, 'value'),
        fieldType = _.result(fieldObj, 'type'),
        converter = _.has(fieldConverters, fieldType) ? fieldConverters[fieldType] : _.identity;

    if (!_.isFunction(converter)) {
      throw new Error('field type is invalid:', fieldObj.type, fieldObj);
    }

    return converter(fieldVal);
  }

  //get field value, and run through converterKey (default 'toAutoprotocol')
  function pluckFieldValueTransformed (fields, fieldName, fieldConverters) {
    var field = utils.pluckField(fields, fieldName);
    return transformField(field, fieldConverters);
  }

  //Given list of fields, and array of desired field keys, returns object where desired key is present only if value is
  // defined, or uses default value if allowDefault is defined
  function getFieldsIfSet (fields, desired, allowDefault, fieldConverters) {
    var obj = {};
    _.forEach(desired, function (desiredKey) {
      var field        = utils.pluckField(fields, desiredKey),
          fieldVal     = transformField(field, fieldConverters),
          fieldDefault = _.result(field, 'default');

      if (fieldVal) {
        obj[desiredKey] = fieldVal;
      } else if (!!allowDefault && !_.isEmpty(fieldDefault)) {
        obj[desiredKey] = fieldDefault;
      }
    });
    return obj;
  }

  /*******
   Iteration
   ******/

  //given array of abstraction fields, convert to keyvals where field.name is key and field.value is value. Does not
  // handle interpolation.
  function simpleKeyvalFields (fields, localParams, fieldConverters) {
    var obj = {};
    _.forEach(fields, function (field) {
      var transformed = transformField(field, fieldConverters);
      if (_.isObject(localParams) && !_.isEmpty(localParams)) {
        transformed = utils.interpolateObject(transformed, localParams);
      }
      obj[field.name] = transformed;
    });
    return obj;
  }

  /*******
   Operation Manipulation
   *******/

  //given wells in op specified by wellsKey (default 'wells) in form "container/well", removes 'container' from each
  // and adds key `containerKey` (default 'object') with value extracted does not handle containers being different
  // currently
  function pluckOperationContainerFromWells (op, containerKey, wellsKey) {
    wellsKey = _.isUndefined(wellsKey) ? 'wells' : wellsKey;
    containerKey = _.isUndefined(containerKey) ? 'object' : containerKey;

    var firstContainer = utils.splitContainerWell(op[wellsKey][0]).container;

    //redo the wells
    var strippedWells = _.map(op[wellsKey], function (well) {
      return utils.splitContainerWell(well).well;
    });

    //need to set key dynamically
    var obj = {};
    obj[containerKey] = firstContainer;
    obj[wellsKey] = strippedWells;

    return _.assign({}, op, obj)
  }

  if (window.omniprotocol.conv.transformField) {
    console.warn('already set up omniprotocol conversion utils');
  } else {
    _.extend(conv, {
      transformField                  : transformField,
      pluckFieldValueTransformed      : pluckFieldValueTransformed,
      getFieldsIfSet                  : getFieldsIfSet,
      simpleKeyvalFields              : simpleKeyvalFields,
      pluckOperationContainerFromWells: pluckOperationContainerFromWells
    });
  }

})(window, document, _);