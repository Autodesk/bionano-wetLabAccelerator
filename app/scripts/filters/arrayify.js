'use strict';

/**
 * @ngdoc filter
 * @name transcripticApp.filter:arrayify
 * @function
 * @description
 * # arrayify
 * Filter in the transcripticApp.
 */
angular.module('transcripticApp')
  .filter('arrayify', function () {
    return function (input) {
      for (var i = 0,
             max = parseInt(input, 10),
             arr = [];
           i < max;
           arr.push(i),
             i++);
      return arr;
    };
  });
