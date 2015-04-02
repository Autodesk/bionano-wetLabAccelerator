'use strict';

 //todo - add scaffolds of each here (once have decided on format for each)

(function (window, document, _, undefined) {
  'use strict';

  //initial checks

  if (typeof _ == 'undefined') {
    console.error('must include lodash');
    return;
  }

  var op     = window.omniprotocol,
      ops    = op.operations || (op.operations = {});

  if (window.omniprotocol.operations.transfer) {
    console.warn('already set up omniprotocol operations');
  } else {
    _.extend(ops, {
      //pipetting
      "transfer"   : {
        operation: "transfer",
        scaffold : ""
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
      "seal"   : {
        "operation": "seal"
      },
      "unseal" : {
        "operation": "unseal"
      },
      "cover"  : {
        "operation": "cover"
      },
      "uncover": {
        "operation": "uncover"
      },


      "spin": {
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

      "store"  : {
        "scaffold": {}
      },
      "discard": {
        "scaffold": {}
      }

    });
  }
})(window, document, _);
