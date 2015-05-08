var _ = require('lodash');

module.exports = {
  "boolean": {
    description        : "true or false",
    "autoprotocol-type": "bool",
    verification       : _.isBoolean
  },
  "string" : {
    description        : "A string",
    "autoprotocol-type": "str",
    verification       : _.isString
  },
  "integer": {
    description        : "An integer",
    "autoprotocol-type": "int",
    verification       : function (input) {
      //todo - do we want this to be a number, or handle string too?
      return _.isNumber(parseInt(input, 10));
    }
  },
  "decimal": {
    description        : "A decimal number",
    "autoprotocol-type": "float",
    verification       : function (input) {
      //todo - do we want this to be a number, or handle string too?
      return _.isNumber(parseFloat(input));
    }
  },

  //container / well

  "container": {
    description        : "A single container",
    "autoprotocol-type": "Container",
    verification       : _.constant(true)
  },

  // dimensional

  "duration"    : {
    description        : "Dimensioned value - duration",
    "autoprotocol-type": "Unit",
    units              : ["millisecond", "second", "minute", "hour"],
    verification       : _.constant(true)
  },
  "temperature" : {
    description        : "Dimensioned value - temperature",
    "autoprotocol-type": "Unit",
    units              : ["celsius"],
    verification       : _.constant(true)
  },
  "length"      : {
    description        : "Dimensioned value - length",
    "autoprotocol-type": "Unit",
    units              : ["nanometer"],
    verification       : _.constant(true)
  },
  "volume"      : {
    description        : "Dimensioned value - volume",
    "autoprotocol-type": "Unit",
    units              : ["nanoliter", "microliter", "milliliter"],
    verification       : _.constant(true)
  },
  "flowrate"    : {
    description        : "Dimensioned value - flow-rate",
    "autoprotocol-type": "Unit",
    units              : ["microliter/second"],
    verification       : _.constant(true)
  },
  "acceleration": {
    description        : "Dimensioned value - acceleration",
    "autoprotocol-type": "Unit",
    units              : ["g", "meter/second^2"],
    verification       : _.constant(true)
  },

  //custom -- should separate these

  "mixwrap"           : {
    description : "A pre- or post- mixing step, in some liquid handling operations",
    verification: function (input) {
      return !!input.volume && _.isNumber(input.repetitions) && !!input.speed;
    }
  },
  "columnVolumes"     : {
    description : "List of columns and volumes",
    verification: function (input) {
      return _.isArray(input) && _.every(input, function (item) {
            return _.isNumber(item.column) && _.isString(item.volume);
          });
    }
  },
  "thermocycle"       : {
    description : "Set of steps in thermocycle",
    verification: function (input) {
      return _.isArray(input) && _.every(input, function (item) {
            return _.isNumber(item.column) && _.isString(item.volume);
          });
    }
  }
};
