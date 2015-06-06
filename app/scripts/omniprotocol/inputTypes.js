var _ = require('lodash');

module.exports = {

  //primitives

  "boolean": {
    category               : "primitive",
    canParameterize    : true,
    description        : "true or false",
    "autoprotocol-category": "bool",
    verification       : _.isBoolean
  },
  "string" : {
    category               : "primitive",
    canParameterize    : true,
    description        : "A string",
    "autoprotocol-category": "str",
    verification       : _.isString
  },
  "integer": {
    category               : "primitive",
    canParameterize    : true,
    description        : "An integer",
    "autoprotocol-category": "int",
    verification       : function (input) {
      //todo - do we want this to be a number, or handle string too?
      return _.isNumber(parseInt(input, 10));
    }
  },
  "decimal": {
    category               : "primitive",
    canParameterize    : true,
    description        : "A decimal number",
    "autoprotocol-category": "float",
    verification       : function (input) {
      //todo - do we want this to be a number, or handle string too?
      return _.isNumber(parseFloat(input));
    }
  },

  //psuedo-primitives

  "option": {
    category           : "primitive",
    canParameterize: false,
    description    : "A dropdown with options",
    verification   : function (input, options) {
      //todo - how to know need to pass in options, and do so dynamically?
      return _.indexOf(options, input) > -1;
    }
  },
  "group" : {
    category               : "primitive",
    canParameterize    : false,
    description        : "an object",
    "autoprotocol-category": "group",
    verification       : function (input) {
      return _.isObject(input) && !_.isEmpty(input);
    }
  },
  "group+": {
    category               : "primitive",
    canParameterize    : false,
    description        : "An Array of objects (groups)",
    "autoprotocol-category": "group+",
    verification       : function (input) {
      return _.isArray(input) && _.every(input, _.isObject);
    }
  },

  //container / well

  "aliquot"  : {
    category               : "container",
    canParameterize    : false,
    description        : "A single aliquot",
    "autoprotocol-category": "Well",
    verification       : _.constant(true)
  },
  "aliquot+" : {
    category               : "container",
    canParameterize    : false,
    description        : "Several aliquot",
    "autoprotocol-category": "WellGroup",
    verification       : _.constant(true)
  },
  "aliquot++": {
    category               : "container",
    canParameterize    : false,
    description        : "Group of multiple aliquots",
    "autoprotocol-category": "list(WellGroup)",
    verification       : _.constant(true)
  },
  "container": {
    category               : "container",
    canParameterize    : false,
    description        : "A single container",
    "autoprotocol-category": "Container",
    verification       : _.constant(true)
  },

  // dimensional

  "duration"    : {
    category               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - duration",
    "autoprotocol-category": "Unit",
    units              : ["millisecond", "second", "minute", "hour"],
    verification       : _.constant(true)
  },
  "temperature" : {
    category               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - temperature",
    "autoprotocol-category": "Unit",
    units              : ["celsius"],
    verification       : _.constant(true)
  },
  "length"      : {
    category               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - length",
    "autoprotocol-category": "Unit",
    units              : ["nanometer"],
    verification       : _.constant(true)
  },
  "volume"      : {
    category               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - volume",
    "autoprotocol-category": "Unit",
    units              : ["nanoliter", "microliter", "milliliter"],
    verification       : _.constant(true)
  },
  "flowrate"    : {
    category               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - flow-rate",
    "autoprotocol-category": "Unit",
    units              : ["microliter/second"],
    verification       : _.constant(true)
  },
  "acceleration": {
    category               : "dimensional",
    canParameterize    : true,
    description        : "Dimensioned value - acceleration",
    "autoprotocol-category": "Unit",
    units              : ["g", "meter/second^2"],
    verification       : _.constant(true)
  },

  //custom -- should separate these

  "resource": {
    category           : "custom",
    canParameterize: true,
    description    : "Resource from the transcriptic catalog",
    verification   : function (input) {
      return _.isString(input);
    }
  },

  "json": {
    category           : "custom",
    canParameterize: false,
    description    : "Arbitrary JSON, e.g. for passing directly to autoprotocol",
    verification   : function (input) {
      try {
        JSON.stringify(input);
      } catch (e) {
        return false;
      }
      return true;
    }
  },

  "mixwrap"           : {
    category           : "custom",
    canParameterize: true,
    description    : "A pre- or post- mixing step, in some liquid handling operations",
    verification   : function (input) {
      return !!input.volume && _.isNumber(input.repetitions) && !!input.speed;
    }
  },
  "columnVolumes"     : {
    category           : "custom",
    readable       : "Column Volumes",
    canParameterize: true,
    description    : "List of columns and volumes",
    verification   : function (input) {
      return _.isArray(input) && _.every(input, function (item) {
          return _.isNumber(item.column) && _.isString(item.volume);
        });
    }
  },
  "thermocycleGroups" : {
    category           : "custom",
    canParameterize: false,
    description    : "Set of groups in thermocycle",
    verification   : function (input) {
      return true;
    }
  },
  "thermocycleGroup"  : {
    category           : "custom",
    canParameterize: true,
    readable       : "Thermocycle",
    description    : "Set of steps in thermocycle",
    verification   : function (input) {
      return _.isArray(input) && _.every(input, function (item) {
          return _.isNumber(item.cycles) && !_.isEmpty(item.steps);
        });
    }
  },
  "thermocycleMelting": {
    category           : "custom",
    canParameterize: true,
    readable       : "Melting",
    description    : "Melting temperature / gradient in thermocycle",
    verification   : _.constant(true)
  },
  "thermocycleDyes"   : {
    category           : "custom",
    canParameterize: true,
    readable       : "Dyes",
    description    : "Dyes mapped to wells for thermocycle",
    verification   : _.constant(true)
  }
};
