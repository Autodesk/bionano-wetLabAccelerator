'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.dimensions
 * @description
 * # dimensions
 * Constant in the transcripticApp.
 */
angular.module('transcripticApp').constant('dimensions', {
  "duration": ["millisecond", "second", "minute", "hour"],
  "volume": ["nanoliter", "microliter", "milliliter"],
  "speed": ["rpm"],
  "length": ["nanometer"],
  "temperature": ["celsius"],
  "matter": ["nanomole, micromole"],
  "flowrate": ["microliter/second"]
});
