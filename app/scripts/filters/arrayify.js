'use strict';

/**
 * @ngdoc filter
 * @name wetLabAccelerator.filter:arrayify
 * @function
 * @description
 * # arrayify
 * Filter in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator')
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
