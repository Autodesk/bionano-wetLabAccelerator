'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txMeasure
 * @attr dimensionValue
 * @attr label
 * @description
 * Input directive which is used for dimensional values (i.e. "value:unit" format)
 *
 * Cf. tx-inputwrap, wihch wraps an input with appropriate styling and label.
 *
 * Use tx-inputwrap for primitives, or inputs which have specific validation (e.g. max/min)
 * Use tx-measure for inputs which are dimensional. Gets options from DimensionOptions service.
 */

//todo - ability to pass in parameters to input
angular.module('transcripticApp')
  .directive('txMeasure', function (DimensionOptions) {
    return {
      templateUrl: 'views/tx-measure.html',
      require: 'ngModel',
      restrict: 'E',
      scope: {
        dimensionType: '@',
        label: '@'
      },
      link: function postLink(scope, element, attrs, ngModel) {

        var internalValueWatcher = angular.noop;

        scope.$watch('dimensionType', function (newval, oldval) {
          cleanup();

          scope.isDimensional = angular.isDefined(DimensionOptions[newval]);
          if (scope.isDimensional) {
            handleDimensionedValue(newval);
          } else {
            handlePrimitiveValue(newval);
          }
        });

        function handleDimensionedValue (newType) {
          scope.options = DimensionOptions[newType];

          scope.dim = convertStringToDim(ngModel.$modelValue) || {
            value: 0,
            unit: scope.options[0]
          };

          internalValueWatcher = scope.$watch('dim', function (newval) {
            dimIsValid(newval) && ngModel.$setViewValue(convertToDimString(newval));
          }, true);
        }

        function handlePrimitiveValue (newType) {
          scope.dim = {
            internal : ngModel.$modelValue
          };

          internalValueWatcher = scope.$watch('dim.internal', function (newval) {
            primitiveIsValid(newType) && ngModel.$setViewValue(newval);
          }, true);
        }

        function dimIsValid (dim) {
          return dim.value > -1 && dim.unit != '';
        }

        function convertToDimString (dim) {
          return dim.value + ':' + dim.unit;
        }

        function convertStringToDim (string) {
          var split = string.split(':');

          if (split.length != 2) {
            return null;
          }

          return {
            value: parseInt(split[0], 10),
            unit: split[1]
          }
        }

        function primitiveIsValid(type) {
          //todo
          return true;
        }

        function cleanup () {
          internalValueWatcher();
          internalValueWatcher = angular.noop;
        }
      }
    };
  });
