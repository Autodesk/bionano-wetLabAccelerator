'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ConversionUtils
 * @description
 * # ConversionUtils
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ConversionUtils', function () {

    var self = this;

    //todo - handle field verification here esp. for dimensional values
    self.simpleMapFields = function (fields, params) {
      var obj = {};
      _.forEach(fields, function (field) {
        console.log(field.name, field.value, params);
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

    self.containerWellDelimiter = "/";

    self.joinContainerWell = function (well, container) {
      return well + self.containerWellDelimiter + container
    };

    //takes an autoprotocol instruction, wraps in pipette group
    self.wrapInPipette = function (instruction) {
      return {
        op: "pipette",
        groups: [instruction]
      };
    };

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
        _.forEach(obj, function (val, key) {
          obj[key] = self.interpolateObject(val, params);
        });
      }
      return obj;
    };
  });
