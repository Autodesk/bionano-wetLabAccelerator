'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.dimensions
 * @description
 * # dimensions
 * Constant in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator').constant('DimensionOptions', {
  "duration": ["millisecond", "second", "minute", "hour"],
  "volume": ["nanoliter", "microliter", "milliliter"],
  "length": ["nanometer"],
  "temperature": ["celsius"],
  "speed": ["microliter/second"],
  "acceleration" : ["g", "meter/second^2"]
});
