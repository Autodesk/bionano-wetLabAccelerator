'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.instructions
 * @description
 * Enumeration of possible instructions, with minimal schema also provided.
 * todo - metadata
 *    description, etc. for a popover?
 *    requirements (e.g. sealed)
 */
angular.module('transcripticApp').constant('InstructionOptions', {
  //pipetting
  "pipette" : {
    scaffold: {
      op: "pipette",
      groups: []
    },
    meta: {}
  },

  "thermocycle": {
    scaffold: {
      op: "thermocycle",
      groups: []
    },
    meta: {}
  },

  //cover / seal
  "seal": {
    scaffold: {
      op: "seal"
    },
    meta: {}
  },
  "unseal": {
    scaffold: {
      op: "unseal"
    },
    meta: {}
  },
  "cover": {
    scaffold: {
      op: "cover"
    },
    meta: {}
  },
  "uncover": {
    scaffold: {
      op: "uncover"
    },
    meta: {}
  },

  //spectrometry
  "absorbance" : {
    scaffold: {
      op: "absorbance"
    },
    meta: {}
  },
  "fluorescence" : {
    scaffold: {
      op: "fluorescence"
    },
    meta: {}
  },
  "luminescence" : {
    scaffold: {
      op: "luminescence"
    },
    meta: {}
  },

  "sangerseq": {
    scaffold: {
      op: "sangerseq"
    },
    meta: {}
  },

  "spin": {
    scaffold: {
      op: "spin"
    },
    meta: {}
  },

  "incubate": {
    scaffold: {
      op: "incubate"
    },
    meta: {}
  },

  "gel_separate" : {
    scaffold: {
      op: "gel_separate"
    },
    meta: {}
  }

  /*
   //todo - make available only in pipette controller
   "transfer" : {},
   "distribute" : {},
   "consolidate" : {},
   "mix" : {},
   */
});
