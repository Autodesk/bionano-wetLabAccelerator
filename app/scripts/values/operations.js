'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.operations
 * @metadata
 * # operations
 * Service in the transcripticApp.
 * //todo - add scaffolds of each here (once have decided on format for each) + converters
 */
angular.module('transcripticApp')
  .constant('Operations', {

    //pipetting
    //todo - update this scaffold
    "transfer"   : {
      "scaffold" : {
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
      toAutoprotocol : function (op) {

      }
    },
    "distribute" : {
      "operation": "distribute"
    },
    "consolidate": {
      "operation": "consolidate"
    },
    "mix"        : {
      "operation": "mix"
    },
    "dispense"   : {
      "operation": "dispense"
    },

    //heating

    "thermocycle": {
      "operation": "thermocycle"
    },

    "incubate": {
      "operation": "incubate"
    },

    //cover / seal
    "seal"    : {
      "operation": "seal"
    },
    "unseal"  : {
      "operation": "unseal"
    },
    "cover"   : {
      "operation": "cover"
    },
    "uncover" : {
      "operation": "uncover"
    },


    "spin"        : {
      "operation": "spin"
    },

    //spectrometry
    "absorbance"  : {
      "operation": "absorbance"
    },
    "fluorescence": {
      "operation": "fluorescence"
    },
    "luminescence": {
      "operation": "luminescence"
    },


    //DNA stuff

    /*
    "sangerseq"   : {
      "operation": "sangerseq"
    },

     */
    "gel_separate": {
      "operation": "gel_separate"
    },

    //containers

    "store" : {
      "scaffold" : {}
    },
    "discard" : {
      "scaffold" : {}
    }

  });
