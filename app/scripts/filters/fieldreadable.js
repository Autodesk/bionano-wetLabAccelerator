'use strict';

/**
 * @ngdoc filter
 * @name transcripticApp.filter:fieldReadable
 * @function
 * @description
 * # fieldReadable
 * Filter in the transcripticApp.
 */
angular.module('transcripticApp')
  .filter('fieldReadable', function () {
    return function (input) {
      return _.isString(input) ? input.replace(/[_-]/, ' ') : input;
    };
  });
