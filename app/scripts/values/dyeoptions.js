'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.dyeOptions
 * @description
 * # dyeOptions
 * Constant in the transcripticApp.
 */
angular.module('transcripticApp').constant('DyeOptions', {
  "channel1" : ["FAM","SYBR"],
  "channel2" : ["VIC","HEX","TET","CALGOLD540"],
  "channel3" : ["ROX","TXR","CALRED610"],
  "channel4" : ["CY5","QUASAR670"],
  "channel5" : ["QUASAR705"]
});
