'use strict';

/**
 * @ngdoc filter
 * @name wetLabAccelerator.filter:fieldReadable
 * @function
 * @description
 * # fieldReadable
 * Filter in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator')
  .filter('fieldReadable', function () {
    return function (input) {
      return _.isString(input) ? input.replace(/[_-]/, ' ') : input;
    };
  });
