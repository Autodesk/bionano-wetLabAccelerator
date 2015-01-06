'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.instructions
 * @description
 * # instructions
 * Constant in the transcripticApp.
 */
angular.module('transcripticApp').constant('InstructionOptions', {
  //pipetting
  "pipette" : {},
  "transfer" : {},
  "distribute" : {},
  "consolidate" : {},
  "mix" : {},

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
  "luminesence" : {},

  "gel_separate" : {},

  "flow" : {}
});
