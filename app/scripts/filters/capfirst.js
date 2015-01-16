'use strict';

/**
 * @ngdoc filter
 * @name transcripticApp.filter:capfirst
 * @function
 * @description
 * # capfirst
 * Filter in the transcripticApp.
 */
angular.module('transcripticApp')
  .filter('capfirst', function () {
    return function (input) {
      return (angular.isString(input) && input.length > 1) ? input.charAt(0).toUpperCase() + input.slice(1) : input;
    };
  });
