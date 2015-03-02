'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.dyeOptions
 * @description
 * # dyeOptions
 * Constant in the transcripticApp.
 * //todo - finish verifications
 */
angular.module('transcripticApp').constant('InputTypes', {
  "aliquot" : {
    description: "A single aliquot",
    "autoprotocol-type" : "Well",
    verification: function (input) {

    }
  },
  "aliquot+" : {
    description: "Several aliquot",
    "autoprotocol-type" : "WellGroup",
    verification: function (input) {

    }
  },
  "aliquot++" : {
    description: "Group of multiple aliquots",
    "autoprotocol-type" : "list(WellGroup)",
    verification: function (input) {

    }
  },
  "container" : {
    description: "A single container",
    "autoprotocol-type" : "Container",
    verification: function (input) {

    }
  },
  "integer" : {
    description: "An integer",
    "autoprotocol-type" : "int",
    verification: function (input) {
      //todo - do we want this to be a number, or handle string too?
      return _.isNumber(parseInt(input, 10));
    }
  },
  "decimal" : {
    description: "A decimal number",
    "autoprotocol-type" : "float",
    verification: function (input) {
      return _.isNumber(parseFloat(input));
    }
  },
  "duration" : {
    description: "Dimensioned value - duration",
    "autoprotocol-type" : "Unit",
    units: ["millisecond", "second", "minute", "hour"],
    verification: function (input) {

    }
  },
  "temperature" : {
    description: "Dimensioned value - temperature",
    "autoprotocol-type" : "Unit",
    units: ["celsius"],
    verification: function (input) {

    }
  },
  "length" : {
    description: "Dimensioned value - length",
    "autoprotocol-type" : "Unit",
    units: ["nanometer"],
    verification: function (input) {

    }
  },
  "volume" : {
    description: "Dimensioned value - volume",
    "autoprotocol-type" : "Unit",
    units: ["nanoliter", "microliter", "milliliter"],
    verification: function (input) {

    }
  },
  "flowrate" : {
    description: "Dimensioned value - flow-rate",
    "autoprotocol-type" : "Unit",
    units: ["microliter/second"],
    verification: function (input) {

    }
  },
  "acceleration": {
    description: "Dimensioned value - acceleration",
    "autoprotocol-type" : "Unit",
    units: ["g", "meter/second^2"],
    verification: function (input) {

    }
  },
  "bool" : {
    description: "true or false",
    "autoprotocol-type" : "bool",
    verification: _.isBoolean
  },
  "string" : {
    description: "A string",
    "autoprotocol-type" : "str",
    verification: _.isString
  },

  //custom -- should separate these

  "options" : {

  }
});
