var _ = require('lodash');

module.exports = {

  //primitives

  "boolean": {
    type               : "primitive",
    canParameterize    : true,
    description        : "true or false",
    "autoprotocol-type": "bool",
    verification       : _.isBoolean
  },
  "string" : {
    type               : "primitive",
    canParameterize    : true,
    description        : "A string",
    "autoprotocol-type": "str",
    verification       : _.isString
  },
  "integer": {
    type               : "primitive",
    canParameterize    : true,
    description        : "An integer",
    "autoprotocol-type": "int",
    verification       : function (input) {
      //todo - do we want this to be a number, or handle string too?
      return _.isNumber(parseInt(input, 10));
    }
  },
  "decimal": {
    type               : "primitive",
    canParameterize    : true,
    description        : "A decimal number",
    "autoprotocol-type": "float",
    verification       : function (input) {
      //todo - do we want this to be a number, or handle string too?
      return _.isNumber(parseFloat(input));
    }
  },

  //psuedo-primitives

  "option"            : {
    type           : "primitive",
    canParameterize: false,
    description    : "A dropdown with options",
    verification   : function (input, options) {
      //todo - how to know need to pass in options, and do so dynamically?
      return _.indexOf(options, input) > -1;
    }
  },
  "group"  : {
    type               : "primitive",
    canParameterize    : false,
    description        : "an object",
    "autoprotocol-type": "group",
    verification       : function (input) {
      return _.isObject(input) && !_.isEmpty(input);
    }
  },
  "group+" : {
    type               : "primitive",
    canParameterize    : false,
    description        : "An Array of objects (groups)",
    "autoprotocol-type": "group+",
    verification       : function (input) {
      return _.isArray(input) && _.every(input, _.isObject);
    }
  },

  //container / well

  "aliquot"  : {
    type               : "container",
    canParameterize    : true,
    description        : "A single aliquot",
    "autoprotocol-type": "Well",
    verification       : _.constant(true)
  },
  "aliquot+" : {
    type               : "container",
    canParameterize    : true,
    description        : "Several aliquot",
    "autoprotocol-type": "WellGroup",
    verification       : _.constant(true)
  },
  "aliquot++": {
    type               : "container",
    canParameterize    : false,
    description        : "Group of multiple aliquots",
    "autoprotocol-type": "list(WellGroup)",
    verification       : _.constant(true)
  },
  "container": {
    type               : "container",
    canParameterize    : false,
    description        : "A single container",
    "autoprotocol-type": "Container",
    verification       : _.constant(true)
  },

  // dimensional

  "duration"    : {
    type               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - duration",
    "autoprotocol-type": "Unit",
    units              : ["millisecond", "second", "minute", "hour"],
    verification       : _.constant(true)
  },
  "temperature" : {
    type               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - temperature",
    "autoprotocol-type": "Unit",
    units              : ["celsius"],
    verification       : _.constant(true)
  },
  "length"      : {
    type               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - length",
    "autoprotocol-type": "Unit",
    units              : ["nanometer"],
    verification       : _.constant(true)
  },
  "volume"      : {
    type               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - volume",
    "autoprotocol-type": "Unit",
    units              : ["nanoliter", "microliter", "milliliter"],
    verification       : _.constant(true)
  },
  "flowrate"    : {
    type               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - flow-rate",
    "autoprotocol-type": "Unit",
    units              : ["microliter/second"],
    verification       : _.constant(true)
  },
  "acceleration": {
    type               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - acceleration",
    "autoprotocol-type": "Unit",
    units              : ["g", "meter/second^2"],
    verification       : _.constant(true)
  },

  //custom -- should separate these

  "mixwrap"           : {
    type           : "custom",
    canParameterize: true,
    description    : "A pre- or post- mixing step, in some liquid handling operations",
    verification   : function (input) {
      return !!input.volume && _.isNumber(input.repetitions) && !!input.speed;
    }
  },
  "columnVolumes"     : {
    type           : "custom",
    canParameterize: true,
    description    : "List of columns and volumes",
    verification   : function (input) {
      return _.isArray(input) && _.every(input, function (item) {
          return _.isNumber(item.column) && _.isString(item.volume);
        });
    }
  },
  "thermocycleGroups" : {
    type           : "custom",
    canParameterize: false,
    description    : "Set of groups in thermocycle",
    verification   : function (input) {
      return true;
    }
  },
  "thermocycleGroup"  : {
    type           : "custom",
    canParameterize: true,
    description    : "Set of steps in thermocycle",
    verification   : function (input) {
      return _.isArray(input) && _.every(input, function (item) {
          return _.isNumber(item.cycles) && !_.isEmpty(item.steps);
        });
    }
  },
  "thermocycleMelting": {
    type           : "custom",
    canParameterize: true,
    description    : "Melting temperature / gradient in thermocycle",
    verification   : _.constant(true)
  },
  "thermocycleDyes"   : {
    type           : "custom",
    canParameterize: true,
    description    : "Dyes mapped to wells for thermocycle",
    verification   : _.constant(true)
  }
};
