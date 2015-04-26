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
    "metadata"  : {
      "name"  : "",
      "id"    : "",
      "type"  : "protocol",
      "author": {}
    },
    "references": [],
    "inputs"    : {},
    "parameters": {},
    "groups"    : groups
  }
}

/********
 Transformations
 ********/

function getNumberUnfoldedSteps (protocol) {
  return _.reduce(protocol.groups, function (result, group, groupLoop) {
    return result + _.result(group, 'loop', 1) * group.steps.length;
  }, 0);
}

//given operation index in protocol (# operation in linear protocol, ignoring loops)
//returns array of possible numbers when unfolded, or empty array if none
function getUnfoldedStepNumbersFromLinear (protocol, foldNum) {
  var result        = [],
      foldIndex     = 0,
      unfoldedIndex = 0;

  _.forEach(protocol.groups, function (group, groupIndex) {
    _.forEach(group.steps, function (step, stepIndex) {
      if (foldNum == foldIndex) {
        var groupLoop = _.result(group, 'loop', 1),
            stepNum   = group.steps.length;

        result = _.map(_.range(groupLoop), function (ind) {
          return unfoldedIndex + (ind * stepNum);
        });
      }

      foldIndex += 1;
      unfoldedIndex += 1;
    });
    //increment for loops, accounting for one run through step already
    unfoldedIndex += (group.steps.length) * (_.result(group, 'loop', 1) - 1);
  });

  return result;
}

//given group and step index,
// returns array of steps when unfolded, or empty if none
function getUnfoldedStepNumbers (protocol, groupIndex, stepIndex) {
  var result = [];
  _.reduce(protocol.groups, function (cumulativeStep, group, groupLoop) {
    var loopNum = _.result(group, 'loop', 1);
    return cumulativeStep + (loopNum * _.reduce(group.steps, function (innerAccumulator, step, stepLoop) {
        if (groupLoop == groupIndex && stepLoop == stepIndex) {
          result = _.map(_.range(loopNum), function (loop) {
            return cumulativeStep + stepLoop + (loop * group.steps.length);
          });
        }
        return group.steps.length;
      }, 0));
  }, 0);
  return result;
}

function getUnfoldedStepNumber (protocol, groupIndex, stepIndex, loopIndex) {
  return getUnfoldedStepNumbers(protocol, groupIndex, stepIndex)[loopIndex];
}

//todo - what is the point of this function? deprecate
//given index of group, index of step in group,
// todo - optionally index in loop (of group.loop) as loopIndex
function getFoldedStepNumber (protocol, groupIndex, stepIndex) {
  var result = -1;
  _.reduce(protocol.groups, function (priorSteps, group, groupLoop) {
    _.forEach(group.steps, function (step, stepLoop) {
      if (stepIndex == stepLoop && groupIndex == groupLoop) {
        result = priorSteps + stepLoop;
      }
    });
    return group.steps.length;
  }, 0);
  return result;
}

//given index in unfolded protocol,
//returns single number
function getFoldedStepInfo (protocol, unfoldNum) {
  var result        = {},
      unfoldedIndex = 0;

  _.forEach(protocol.groups, function (group, groupIndex) {
    var loopNum = _.result(group, 'loop', 1);
    _.forEach(_.range(loopNum), function (groupLoopIndex) {
      _.forEach(group.steps, function (step, stepIndex) {
        if (unfoldNum == unfoldedIndex) {
          _.assign(result, {
            group   : groupIndex,
            step    : stepIndex,
            loop    : groupLoopIndex,
            unfolded: unfoldNum
          });
        }

        unfoldedIndex += 1;
      });
    });
  });

  return result;
}

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
  pluckField                      : pluckField,
  pluckFieldValueRaw              : pluckFieldValueRaw,
  interpolateValue                : interpolateValue,
  interpolateObject               : interpolateObject,
  wrapFieldsAsStep                : wrapFieldsAsStep,
  scaffoldOperationWithValues     : scaffoldOperationWithValues,
  getFieldTypeInOperation         : getFieldTypeInOperation,
  wrapOpInGroup                   : wrapOpInGroup,
  wrapGroupsInProtocol            : wrapGroupsInProtocol,
  getNumberUnfoldedSteps          : getNumberUnfoldedSteps,
  getUnfoldedStepNumber           : getUnfoldedStepNumber,
  getUnfoldedStepNumbers          : getUnfoldedStepNumbers,
  getUnfoldedStepNumbersFromLinear: getUnfoldedStepNumbersFromLinear,
  getFoldedStepNumber             : getFoldedStepNumber,
  getFoldedStepInfo               : getFoldedStepInfo,
  getTransformsContainer          : getTransformsContainer,
  getTransformsWell               : getTransformsWell
};