'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.dyeOptions
 * @description
 * # dyeOptions
 * Constant in the transcripticApp.
 * //todo - finish verifications
 * //todo - incorporate transformations here
 */
angular.module('transcripticApp').service('InputTypes', function (AbstractionUtils) {
  return {

    //primitives

    "boolean": {
      description        : "true or false",
      "autoprotocol-type": "bool",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : _.isBoolean
    },
    "string" : {
      description        : "A string",
      "autoprotocol-type": "str",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : _.isString
    },
    "integer": {
      description        : "An integer",
      "autoprotocol-type": "int",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {
        //todo - do we want this to be a number, or handle string too?
        return _.isNumber(parseInt(input, 10));
      }
    },
    "decimal": {
      description        : "A decimal number",
      "autoprotocol-type": "float",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {
        //todo - do we want this to be a number, or handle string too?
        return _.isNumber(parseFloat(input));
      }
    },
    "group": {
      description        : "an object",
      "autoprotocol-type": "group",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {
        return _.isObject(input) && !_.isEmpty(input);
      }
    },
    "group+": {
      description        : "An Array of objects (groups)",
      "autoprotocol-type": "group+",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {
        return _.isArray(input) && _.every(input, _.isObject);
      }
    },

    //container / well

    "aliquot"  : {
      description        : "A single aliquot",
      "autoprotocol-type": "Well",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },
    "aliquot+" : {
      description        : "Several aliquot",
      "autoprotocol-type": "WellGroup",
      toAutoprotocol     : function (input, ignoreContainer) {
        return AbstractionUtils.flattenAliquots(input, ignoreContainer);
      },
      verification       : function (input) {

      }
    },
    "aliquot++": {
      description        : "Group of multiple aliquots",
      "autoprotocol-type": "list(WellGroup)",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },
    "container": {
      description        : "A single container",
      "autoprotocol-type": "Container",
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },

    // dimensional

    "duration"    : {
      description        : "Dimensioned value - duration",
      "autoprotocol-type": "Unit",
      units              : ["millisecond", "second", "minute", "hour"],
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },
    "temperature" : {
      description        : "Dimensioned value - temperature",
      "autoprotocol-type": "Unit",
      units              : ["celsius"],
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },
    "length"      : {
      description        : "Dimensioned value - length",
      "autoprotocol-type": "Unit",
      units              : ["nanometer"],
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },
    "volume"      : {
      description        : "Dimensioned value - volume",
      "autoprotocol-type": "Unit",
      units              : ["nanoliter", "microliter", "milliliter"],
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },
    "flowrate"    : {
      description        : "Dimensioned value - flow-rate",
      "autoprotocol-type": "Unit",
      units              : ["microliter/second"],
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },
    "acceleration": {
      description        : "Dimensioned value - acceleration",
      "autoprotocol-type": "Unit",
      units              : ["g", "meter/second^2"],
      toAutoprotocol     : function (input) {
        return input;
      },
      verification       : function (input) {

      }
    },

    //custom -- should separate these

    "option"            : {
      description   : "A dropdown with options",
      toAutoprotocol: function (input) {
        return input;
      },
      verification  : function (input, options) {
        //how to know need to pass in options, and do so dynamically?
        return _.indexOf(options, input) > -1;
      }
    },
    "mixwrap"           : {
      description   : "A pre- or post- mixing step, in some liquid handling operations",
      toAutoprotocol: function (input) {
        return input;
      },
      verification  : function (input) {
        return !!input.volume && _.isNumber(input.repetitions) && !!input.speed;
      }
    },
    "columnVolumes"     : {
      description   : "List of columns and volumes",
      toAutoprotocol: function (input) {
        return input;
      },
      verification  : function (input) {
        return _.isArray(input) && _.every(input, function (item) {
            return _.isNumber(item.column) && _.isString(item.volume);
          });
      }
    },
    "thermocycleGroup"   : {
      description   : "Set of steps in thermocycle",
      toAutoprotocol: function (input) {
        return _.map(input, function (group) {
          return {
            cycles: group.cycles,
            steps: _.map(group.steps, function (step) {
              return _.assign({
                duration: step.duration,
                read: _.result(step, 'read', true)
              }, (step.isGradient ?
                  {
                    gradient : {
                      top: step.gradientStart,
                      end: step.gradientEnd
                    }
                  } :
                  {
                    temperature : step.temperature
                  }
                )
              );
            })
          };
        });
      },
      verification  : function (input) {
        return _.isArray(input) && _.every(input, function (item) {
            return _.isNumber(item.column) && _.isString(item.volume);
          });
      }
    },
    "thermocycleMelting": {
      description   : "Melting temperature / gradient in thermocycle",
      toAutoprotocol: function (input) {
        return input;
      },
      verification  : function (input) {

      }
    },
    "thermocycleDyes"   : {
      description   : "Dyes mapped to wells for thermocycle",
      toAutoprotocol: function (input) {
        return _.zipObject(
          _.pluck(input, 'dye'),
          input.wells
        );
      },
      verification  : function (input) {

      }
    }
  }
});
