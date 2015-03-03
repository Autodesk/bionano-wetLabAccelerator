'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.operations
 * @metadata
 * # operations
 * Service in the transcripticApp.
 * //todo - add scaffolds of each here (once have decided on format for each)
 */
angular.module('transcripticApp')
  .constant('Operations', {

    //pipetting
    //todo - update this scaffold
    "transfer"   : {
      "operation"   : "transfer",
      "requirements": {},
      "transforms"  : [
        {
          "container": "to_container",
          "wells"    : "to_wells"
        },
        {
          "container": "from_container",
          "wells"    : "from_wells"
        }
      ],
      "fields"      : [
        {
          "name" : "volume",
          "type" : "volume",
          "value": "10.0:microliter"
        },
        {
          "name" : "to_container",
          "type" : "container",
          "value": "growth_plate"
        },
        {
          "name"   : "to_wells",
          "type"   : "well",
          "isArray": true,
          "value"  : [
            "A2"
          ]
        },
        {
          "name" : "from_container",
          "type" : "container",
          "value": "ecoli_container"
        },
        {
          "name"   : "from_wells",
          "type"   : "well",
          "isArray": true,
          "value"  : [
            "A1"
          ]
        },
        {
          "name" : "mix_after",
          "type" : "mixwrap",
          "value": {
            "volume"     : "10.0:microliter",
            "repetitions": 5,
            "speed"      : "100:microliter/second"
          }
        }
      ]
    },
    "distribute" : {
      metadata: {
        "description": ""
      }
    },
    "consolidate": {
      metadata: {
        "description": ""
      }
    },
    "mix"        : {
      metadata: {
        "description": ""
      }
    },
    "dispense"   : {
      metadata: {
        "description": ""
      }
    },

    //heating

    "thermocycle": {
      metadata: {
        "description": ""
      }
    },

    "incubate": {
      metadata: {
        "description": ""
      }
    },

    //cover / seal
    "seal"    : {
      metadata: {
        "description": ""
      }
    },
    "unseal"  : {
      metadata: {
        "description": ""
      }
    },
    "cover"   : {
      metadata: {
        "description": ""
      }
    },
    "uncover" : {
      metadata: {
        "description": ""
      }
    },


    "spin"        : {
      metadata: {
        "description": ""
      }
    },

    //spectrometry
    "absorbance"  : {
      metadata: {
        "description": ""
      }
    },
    "fluorescence": {
      metadata: {
        "description": ""
      }
    },
    "luminescence": {
      metadata: {
        "description": ""
      }
    },


    //DNA stuff
    "sangerseq"   : {
      metadata: {
        "description": ""
      }
    },
    "gel_separate": {
      metadata: {
        "description": ""
      }
    }
  });
