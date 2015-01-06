'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.containers
 * @description
 * # containers
 * Constant in the transcripticApp.
 */
angular.module('transcripticApp').constant('containers', {
  "96-pcr": {
    "max": 160,
    "dead": 15,
    "capabilities": ["pipette", "sangerseq", "spin", "thermocycle", "incubate", "gel_separate"]
  },
  "96-flat": {
    "max": 360,
    "dead": 20,
    "capabilities": ["pipette", "sangerseq", "spin", "absorbance", "fluorescence", "luminescence", "incubate", "gel_separate"]
  },
  "96-flat-uv": {
    "max": 360,
    "dead": 20,
    "capabilities": ["pipette", "sangerseq", "spin", "absorbance", "fluorescence", "luminescence", "incubate", "gel_separate"]
  },
  "96-deep": {
    "max": 2000,
    "dead": 15,
    "capabilities": ["pipette", "sangerseq", "spin", "incubate", "gel_separate"]
  },
  "384-pcr": {
    "max": 50,
    "dead": 8,
    "capabilities": ["pipette", "sangerseq", "spin", "thermocycle", "incubate", "gel_separate"]
  },
  "384-flat": {
    "max": 112,
    "dead": 12,
    "capabilities": ["pipette", "sangerseq", "spin", "absorbance", "fluorescence", "luminescence", "incubate", "gel_separate"]
  },
  "pcr-0.5": {
    "max": 500,
    "dead": 15,
    "capabilities": ["pipette", "sangerseq", "spin", "incubate", "gel_separate"]
  },
  "micro-1.5": {
    "max": 1500,
    "dead": 15,
    "capabilities": ["pipette", "sangerseq", "spin", "incubate", "gel_separate"]
  },
  "micro-2.0": {
    "max": 2000,
    "dead": 15,
    "capabilities": ["pipette", "sangerseq", "spin", "incubate", "gel_separate"]
  }
});
