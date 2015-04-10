var _          = require('lodash'),
    operations = require('./operations.js');

/*******
 Fields
 ******/

function pluckField (fields, fieldName) {
  return _.find(fields, {name: fieldName});
}

//get the raw field value. Only use if going to handle transformation later.
function pluckFieldValueRaw (fields, fieldName) {
  return _.result(pluckField(fields, fieldName), 'value');
}

/*******
 Interpolation
 ******/

//interpolates a string using the params passed
function interpolateValue (value, params) {
  try {
    return _.template(value)(params);
  } catch (e) {
    console.warn('error interpolating', value, params, e);
    return value;
  }
}

// note - if the string contains a variable which cannot be templated, it will just be returned (useful for doing
// multiple passes) note - if there are multiple variables, if any variable is in the dictionary, they will all be
// interpolated, and undefined templates will resolve to empty strings. example: interpolateObject({"myVal" : "hey
// ${you}", "myObj" : {"greet" : "hi ${me}"} }, {you: "bobby", me: "max"}) -> { myObj: { greet: "hi max"} myVal: "hey
// bobby" }
function interpolateObject (obj, params) {
  if (_.isString(obj))
    return interpolateValue(obj, params);
  else {
    _.mapValues(obj, _.partial(interpolateObject, _, params));
  }
  return obj;
}

/*****
 Operations
 *****/

function wrapFieldsAsStep (fieldsArray) {
  return {
    "operation"   : "",
    "requirements": {},
    "transforms"  : [],
    "fields"      : fieldsArray
  };
}

function scaffoldOperationWithValues (operationName, fieldVals) {
  var clone    = _.clone(_.result(operations, operationName, null)),
      scaffold = _.result(clone, 'scaffold', null);

  if (_.isEmpty(scaffold)) {
    throw new Error("operation " + operationName + " not present")
  }

  _.forEach(fieldVals, function (fieldVal, fieldName) {
    _.assign(pluckField(scaffold.fields, fieldName), {value: fieldVal});
  });

  return scaffold;
}

function getFieldTypeInOperation (operationName, fieldName) {
  var op        = _.result(operations, operationName, null),
      scaffold  = _.result(op, 'scaffold', null),
      fields    = _.result(scaffold, 'fields'),
      field     = pluckField(fields, fieldName),
      fieldType = _.result(field, 'type', null);

  return fieldType;
}

/*******
 Wells
 ******/

//given array of objects with keys container + well, create array of strings in format "container/well", or "well" if
// ignoreContainer is truthy
function flattenAliquots (abstAliquots, ignoreContainer) {
  if (!!ignoreContainer) {
    return _.map(abstAliquots, _.partial(_.result, _, 'well'));
  } else {
    return _.map(abstAliquots, function (aliquot) {
      return joinContainerWell(aliquot.container, aliquot.well);
    });
  }
}

/*******
 Wrapping
 ******/

function wrapOpInGroup (op) {
  return {
    name    : "",
    inputs  : {},
    metadata: {},
    loop    : 1,
    steps   : [
      op
    ]
  }
}

function wrapGroupsInProtocol (groupsInput) {
  var groups = _.isArray(groupsInput) ? groupsInput : [groupsInput];

  return {
    "name"      : "",
    "references": [],
    "inputs"    : {},
    "parameters": {},
    "metadata"  : {},
    "groups"    : groups
  }
}

/********
 Transformations
 ********/

// note - would be great to DRY, but lots of variables needed to pass in then

function getTransformsContainer (protocol, container) {
  var result = [],
      index  = 0;

  _.forEach(protocol.groups, function (group, groupIndex) {
    _.forEach(group.steps, function (step, stepIndex) {
      _.forEach(step.transforms, function (transform) {
        if (_.result(transform, 'container')) {
          var containerField = pluckField(step.fields, transform.container),
              containerName  = _.result(containerField, 'value');
          if (containerName == container) {
            result.push({
              container: container,
              op       : step.operation,
              field    : containerField,
              index    : {
                group    : groupIndex,
                step     : stepIndex,
                unwrapped: _.map(new Array(_.result(group, 'loop', 1)), function (undef, ind) {
                  return index + (ind * group.steps.length);
                })
              },
              times    : _.result(group, 'loop', 1),
              step     : step
            });
          }
        }
      });
      //increment for the step
      index += 1;
    });
    //increment for loops, accounting for one run through step already
    index += (group.steps.length) * (_.result(group, 'loop', 1) - 1)
  });

  return result;
}

function getTransformsWell (protocol, well) {
  var result = [],
      index  = 0;

  _.forEach(protocol.groups, function (group, groupIndex) {
    _.forEach(group.steps, function (step, stepIndex) {
      _.forEach(step.transforms, function (transform) {
        if (_.result(transform, 'wells')) {
          var wellsField = pluckField(step.fields, transform.wells),
              wellsArray = _.result(wellsField, 'value');
          _.forEach(wellsArray, function (wellObj) {
            if (wellObj.well == well) {
              result.push({
                well : well,
                op   : step.operation,
                field: wellsField,
                index: {
                  group    : groupIndex,
                  step     : stepIndex,
                  unwrapped: _.map(new Array(_.result(group, 'loop', 1)), function (undef, ind) {
                    return index + (ind * group.steps.length);
                  })
                },
                times: _.result(group, 'loop', 1),
                step : step
              });

              //end the loop
              return false;
            }
          });
        }
      });
      //increment for the step
      index += 1;
    });
    //increment for loops, accounting for one run through step already
    index += (group.steps.length) * (_.result(group, 'loop', 1) - 1)
  });

  return result;
}

module.exports = {
  pluckField                 : pluckField,
  pluckFieldValueRaw         : pluckFieldValueRaw,
  interpolateValue           : interpolateValue,
  interpolateObject          : interpolateObject,
  wrapFieldsAsStep           : wrapFieldsAsStep,
  scaffoldOperationWithValues: scaffoldOperationWithValues,
  getFieldTypeInOperation    : getFieldTypeInOperation,
  flattenAliquots            : flattenAliquots,
  wrapOpInGroup              : wrapOpInGroup,
  wrapGroupsInProtocol       : wrapGroupsInProtocol,
  getTransformsContainer     : getTransformsContainer,
  getTransformsWell          : getTransformsWell
};