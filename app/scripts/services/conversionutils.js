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
        obj[field.name] = interpolateValue(field.value, params);
      });
      return obj;
    };

    //simply maps an operation and fields directly to keys and values
    self.simpleMapOperation = function (op, params) {
      return _.assign({
        op : op.operation
      }, self.simpleMapFields(op.fields));
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
  });
