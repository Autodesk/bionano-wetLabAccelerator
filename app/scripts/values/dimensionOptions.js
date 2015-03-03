'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.dimensions
 * @description
 * # dimensions
 * Constant in the transcripticApp.
 */
angular.module('transcripticApp').constant('DimensionOptions', {
  "duration": ["millisecond", "second", "minute", "hour"],
  "volume": ["nanoliter", "microliter", "milliliter"],
  "length": ["nanometer"],
  "temperature": ["celsius"],
  "flowrate": ["microliter/second"],
  "acceleration" : ["g", "meter/second^2"]
});
