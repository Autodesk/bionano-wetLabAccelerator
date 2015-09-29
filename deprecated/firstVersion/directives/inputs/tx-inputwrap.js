'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txInputwrap
 * @attr label
 * @description
 * Simple directive to wrap an input with appropriate styling and label.
 *
 * Cf. tx-measure, which is used for dimensional values (i.e. "value:unit" format)
 *
 * Use tx-inputwrap for primitives, or inputs which have specific validation (e.g. max/min)
 * Use tx-measure for inputs which are dimensional. Gets options from DimensionOptions service.
 */
angular.module('wetLabAccelerator')
  .directive('txInputwrap', function () {
    return {
      templateUrl: 'views/tx-inputwrap.html',
      transclude: true,
      restrict: 'E',
      scope: {
        label: '@'
      }
    };
  });
