'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.operations
 * @metadata
 * # operations
 * Service in the transcripticApp.
 * //todo - add scaffolds of each here
 */
angular.module('transcripticApp')
  .constant('Operations', {

    //pipetting

    "transfer"   : {
      metadata: {
        "description": ""
      }
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
