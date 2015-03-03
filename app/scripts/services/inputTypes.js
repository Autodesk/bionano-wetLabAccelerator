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

  //primitives

  "boolean" : {
    description: "true or false",
    "autoprotocol-type" : "bool",
    verification: _.isBoolean
  },
  "string" : {
    description: "A string",
    "autoprotocol-type" : "str",
    verification: _.isString
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

  //container / well

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

  // dimensional

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

  //custom -- should separate these

  "option" : {
    description: "A dropdown with options",
    verification: function (input) {
      //how to verify without the list of possibilities?
    }
  },
  "mixwrap" : {
    description: "A pre- or post- mixing step, in some liquid handling operations",
    verification: function (input) {
      return !!input.volume && _.isNumber(input.repetitions) && !!input.speed;
    }
  },
  "columnVolumes" : {
    description: "List of columns and volumes",
    verification: function (input) {
      return _.isArray(input) && _.every(input, function (item) {
        return _.isNumber(item.column) && _.isString(item.volume);
      });
    }
  },
  "thermocycleGrop" : {
    description: "Set of steps in thermocycle",
    verification: function (input) {
      return _.isArray(input) && _.every(input, function (item) {
          return _.isNumber(item.column) && _.isString(item.volume);
        });
    }
  },
  "thermocycleMelting" : {
    description: "Melting temperature / gradient in thermocycle",
    verification: function (input) {

    }
  },
  "thermocycleDyes" : {
    description: "Dyes mapped to wells for thermocycle",
    verification: function (input) {

    }
  }
});
