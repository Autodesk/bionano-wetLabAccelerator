'use strict';

//note - deprecated. use operations service instead

/**
 * @ngdoc service
 * @name wetLabAccelerator.instructions
 * @description
 * Enumeration of possible instructions, with minimal schema also provided.
 * todo - descriptiondata
 *    description, etc. for a popover?
 *    requirements (e.g. sealed)
 */
angular.module('wetLabAccelerator').constant('InstructionOptions', {
  //pipetting
  "pipette" : {
    scaffold: {
      op: "pipette",
      groups: []
    },
    description: {}
  },

  "dispense" : {
    scaffold: {
      op: "dispense"
    },
    description: {}
  },

  "thermocycle": {
    scaffold: {
      op: "thermocycle",
      groups: []
    },
    description: {}
  },

  //cover / seal
  "seal": {
    scaffold: {
      op: "seal"
    },
    description: {}
  },
  "unseal": {
    scaffold: {
      op: "unseal"
    },
    description: {}
  },
  "cover": {
    scaffold: {
      op: "cover"
    },
    description: {}
  },
  "uncover": {
    scaffold: {
      op: "uncover"
    },
    description: {}
  },

  //spectrometry
  "absorbance" : {
    scaffold: {
      op: "absorbance"
    },
    description: {}
  },
  "fluorescence" : {
    scaffold: {
      op: "fluorescence"
    },
    description: {}
  },
  "luminescence" : {
    scaffold: {
      op: "luminescence"
    },
    description: {}
  },

  "sangerseq": {
    scaffold: {
      op: "sangerseq"
    },
    description: {}
  },

  "spin": {
    scaffold: {
      op: "spin"
    },
    description: {}
  },

  "incubate": {
    scaffold: {
      op: "incubate"
    },
    description: {}
  },

  "gel_separate" : {
    scaffold: {
      op: "gel_separate"
    },
    description: {}
  }

  /*
   //todo - make available only in pipette controller
   "transfer" : {},
   "distribute" : {},
   "consolidate" : {},
   "mix" : {},
   */
});
