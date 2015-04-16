'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.OligoOptions
 * @description
 * # OligoOptions
 * Constant in the transcripticApp.
 */
angular.module('transcripticApp').constant('OligoOptions', {
  scale : [
    {"value": 25, "unit": "nanomole"},
    {"value": 50, "unit": "nanomole"},
    {"value": 200, "unit": "nanomole"},
    {"value": 1, "unit": "micromole"},
    {"value": 10, "unit": "micromole"}
  ],
  purity: ["desalt", "hplc", "page"]
});
