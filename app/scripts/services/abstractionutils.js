'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AbstractionUtils
 * @description
 * # AbstractionUtils
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('AbstractionUtils', function () {
    var self = this;

    self.pluckField = function pluckField (fields, fieldName) {
      return _.find(fields, {name : fieldName});
    };

    //get the raw field value. Only use if going to handle transformation later.
    self.pluckFieldValueRaw = function pluckFieldValueRaw (fields, fieldName) {
      return _.result(self.pluckField(fields, fieldName), 'value');
    };

    /*******
     Interpolation
     ******/

      //interpolates a string using the params passed
    self.interpolateValue = function interpolateValue(value, params) {
      try {
        return _.template(value)(params);
      } catch (e) {
        console.warn('error interpolating', value, params, e);
        return value;
      }
    };

    // todo - clarify handling undefined
    // todo - clarify multiple variables in string
    //example: interpolateObject({"myVal" : "hey ${you}", "myObj" : {"greet" : "hi ${me}"} }, {you: "bobby", me: "max"})
    // -> { myObj: { greet: "hi max"} myVal: "hey bobby" }
    self.interpolateObject = function interpolateObject(obj, params) {
      if (_.isString(obj))
        return self.interpolateValue(obj, params);
      else {
        _.mapValues(obj, _.partial(self.interpolateObject, _, params));
      }
      return obj;
    };

    /*******
     Wells
     ******/

    var containerWellDelimiter = "/";

    self.joinContainerWell = function (container, well, tempDelimiter) {
      return '' + container + (_.isString(tempDelimiter) ? tempDelimiter : containerWellDelimiter) + well;
    };

    //given a string in form "container/well", returns object in form { container : '<container>', well: '<well>' }
    self.splitContainerWell = function (containerWell) {
      var split = containerWell.split("/");
      return {
        container: split[0],
        well: split[1]
      };
    };

    //given array of objects with keys container + well, create array of strings in format "container/well", or "well" if ignoreContainer is truthy
    self.flattenAliquots = function (abstAliquots, ignoreContainer) {
      if (!!ignoreContainer) {
        return _.map(abstAliquots, _.partial(_.result, _, 'well'));
      } else {
        return _.map(abstAliquots, function (aliquot) {
          return self.joinContainerWell(aliquot.container, aliquot.well);
        });
      }
    };

    /*******
     Wrapping
     ******/

    self.wrapOpInGroup = function (op) {
      return {
        name    : "",
        inputs  : {},
        metadata: {},
        loop    : 1,
        steps   : [
          op
        ]
      }
    };

    self.wrapGroupsInProtocol = function (groupsInput) {
      var groups = _.isArray(groupsInput) ? groupsInput : [groupsInput];

      return {
        "name"      : "",
        "references": [],
        "inputs"    : {},
        "parameters": {},
        "metadata"  : {},
        "groups"    : groups
      }
    };

    /********
     Transformations
     ********/

    //todo - DRY these out
    self.getTransformsContainer = function getTransformsContainer (protocol, container) {

      var result = [],
          index = 0;

      _.forEach(protocol.groups, function (group, groupIndex) {
        _.forEach(group.steps, function (step, stepIndex) {
          _.forEach(step.transforms, function (transform) {
            if ( _.result(transform, 'container') ) {
              var containerField = self.pluckField(step.fields, transform.container),
                  containerName = _.result(containerField, 'value');
              if (containerName == container) {
                result.push({
                  container : container,
                  op: step.operation,
                  field: containerField,
                  index : {
                    group: groupIndex,
                    step: stepIndex,
                    unwrapped: _.map(new Array(_.result(group, 'loop', 1)), function (undef, ind) {
                      return index + (ind * group.steps.length);
                    })
                  },
                  times: _.result(group, 'loop', 1),
                  step: step
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
    };

    self.getTransformsWell = function getTransformsContainer (protocol, well) {
      var result = [],
          index = 0;

      _.forEach(protocol.groups, function (group, groupIndex) {
        _.forEach(group.steps, function (step, stepIndex) {
          _.forEach(step.transforms, function (transform) {
            if ( _.result(transform, 'wells') ) {
              var wellsField = self.pluckField(step.fields, transform.wells),
                  wellsArray = _.result(wellsField, 'value');
              _.forEach(wellsArray, function (wellObj) {
                if (wellObj.well == well) {
                  result.push({
                    well : well,
                    op: step.operation,
                    field: wellsField,
                    index : {
                      group: groupIndex,
                      step: stepIndex,
                      unwrapped: _.map(new Array(_.result(group, 'loop', 1)), function (undef, ind) {
                        return index + (ind * group.steps.length);
                      })
                    },
                    times: _.result(group, 'loop', 1),
                    step: step
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
    };
  });
