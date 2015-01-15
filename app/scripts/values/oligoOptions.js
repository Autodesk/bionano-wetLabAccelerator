'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.OligoOptions
 * @description
 * # OligoOptions
 * Constant in the transcripticApp.
 */
angular.module('transcripticApp').constant('OligoOptions', {
  scale: ["25:nanomole", "50:nanomole", "200:nanomole", "1:micromole", "10:micromole" ],
  purity: ["desalt", "hplc", "page"]
});
