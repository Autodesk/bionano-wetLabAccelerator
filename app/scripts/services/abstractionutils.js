'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AbstractionUtils
 * @description
 * # AbstractionUtils
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('AbstractionUtils', function (ConversionUtils) {
    var self = this;

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

    self.joinContainerWell = function (container, well, tempDelimiter) {
      return '' + container + (_.isString(tempDelimiter) ? tempDelimiter : containerWellDelimiter) + well;
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
  });
