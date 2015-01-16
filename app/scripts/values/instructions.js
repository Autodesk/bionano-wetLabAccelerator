'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.instructions
 * @description
 * Enumeration of possible instructions
 *
 * todo
 * - basic scaffolding schema
 * - support types and type checks
 * - preconditions
 */
angular.module('transcripticApp').constant('InstructionOptions', {
  //pipetting
  "pipette" : {},

  /*
  //ignoring these, make available only in pipette
  "transfer" : {},
  "distribute" : {},
  "consolidate" : {},
  "mix" : {},
  */

  //cover / seal
  "seal": {},
  "unseal": {},
  "cover": {},
  "uncover": {},

  "sangerseq": {},

  "spin": {},

  "thermocycle": {},

  "incubate": {},

  //spectrometry
  "absorbance" : {},
  "fluorescence" : {},
  "luminescence" : {},

  "gel_separate" : {}
});
