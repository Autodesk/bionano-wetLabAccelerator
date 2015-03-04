'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ConversionUtils
 * @description
 * # ConversionUtils
 * Service in the transcripticApp.
 * todo - rename this service
 */
angular.module('transcripticApp')
  .service('ConversionUtils', function () {

    var self = this;

    var containerWellDelimiter = "/";

    /*******
     Iteration
     ******/

    //todo - handle field verification here esp. for dimensional values
    self.simpleMapFields = function (fields, params) {
      var obj = {};
      _.forEach(fields, function (field) {
        obj[field.name] = self.interpolateValue(field.value, params);
      });
      return obj;
    };

    //simply maps an operation and fields directly to keys and values
    self.simpleMapOperation = function (op, params) {
      return _.assign({
        op : op.operation
      }, self.simpleMapFields(op.fields, params));
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

    /*******
     Wells
     ******/

    self.joinContainerWell = function (container, well, tempDelimiter) {
      return container + (_.isString(tempDelimiter) ? tempDelimiter : containerWellDelimiter) + well;
    };

    /*******
     Interpolation
     ******/

    //interpolates a string using the params passed
    self.interpolateValue = function interpolateValue (value, params) {
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
  });
