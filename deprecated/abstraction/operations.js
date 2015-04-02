'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.operations
 * @metadata
 * # operations
 * Service in the transcripticApp.
 * //todo - add scaffolds of each here (once have decided on format for each)
 */
angular.module('tx.abstraction')
  .constant('Operations', {

    //pipetting
    //todo - update this scaffold
    "transfer"   : {
      operation: "transfer",
      scaffold: ""
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
