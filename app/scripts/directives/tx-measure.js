'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txMeasure
 * @description
 * # txMeasure
 * //todo - option for array
 */
angular.module('transcripticApp')
  .directive('txMeasure', function (DimensionOptions) {
    return {
      templateUrl: 'views/tx-measure.html',
      require: 'ngModel',
      restrict: 'E',
      scope: {
        dimensionType: '@'
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
          scope.internalValue = ngModel.$modelValue;

          internalValueWatcher = scope.$watch('internalValue', function (newval) {
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
