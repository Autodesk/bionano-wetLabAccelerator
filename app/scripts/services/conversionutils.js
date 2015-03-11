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

    //given array of abstraction fields, convert to keyvals where field.name is key and field.value is value. Does not handle interpolation.
    self.simpleKeyvalFields = function (fields) {
      var obj = {};
      _.forEach(fields, function (field) {
        obj[field.name] = field.value;
      });
      return obj;
    };

    //simply maps an operation and fields directly to keys and values
    self.simpleMapOperation = function (op) {
      return _.assign({
        op : op.operation
      }, self.simpleKeyvalFields(op.fields));
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
