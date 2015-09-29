'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txMeasure
 * @attr dimensionValue
 * @attr label
 * @attr notRequired Force so UI won't show as required (this is less common, so requies flag)
 * @description
 * Input directive which is used for dimensional values (i.e. "value:unit" format)
 *
 * Cf. tx-inputwrap, wihch wraps an input with appropriate styling and label.
 *
 * Use tx-inputwrap for primitives, or inputs which have specific validation (e.g. max/min)
 * Use tx-measure for inputs which are dimensional. Gets options from DimensionOptions service.
 */

//todo - ability to pass in parameters to input (sp. min and max)
//todo - clearer UI when not set - don't set if scope.unrequired
angular.module('wetLabAccelerator')
  .directive('txMeasure', function (DimensionOptions) {
    return {
      templateUrl: 'views/tx-measure.html',
      require: 'ngModel',
      restrict: 'E',
      scope: {
        externalModel: '=ngModel',
        dimensionType: '@',
        label: '@'
      },
      link: function postLink(scope, element, attrs, ngModel) {

        var internalValueWatcher = angular.noop;

        scope.unrequired = angular.isDefined(attrs.notRequired);

        //set up watches for changes to external model, or dimension type

        scope.$watch('externalModel', function (newval, oldval) {
          if (!newval) return;
          scope.isDimensional ? setInternal_dimensional(newval) : setInternal_primitive(newval);
        });

        scope.$watch('dimensionType', function (newval, oldval) {
          cleanup();

          scope.isDimensional = angular.isDefined(DimensionOptions[newval]);
          if (scope.isDimensional) {
            handleDimensionedValue(newval);
          } else {
            handlePrimitiveValue(newval);
          }
        });

        //functions for setting internal model, depending on dimension / primitive

        function setInternal_dimensional (newval) {
          newval = newval || ngModel.$modelValue;
          scope.dim = convertStringToDim(newval) || {
            value: null,
            unit: scope.options[0]
          };
        }

        function setInternal_primitive (newval) {
          newval = newval || ngModel.$modelValue;
          scope.dim = {
            internal : newval
          };
        }

        //handlers for incoming values

        function handleDimensionedValue (newType) {
          scope.options = DimensionOptions[newType];

          setInternal_dimensional();

          internalValueWatcher = scope.$watch('dim', function (newval) {
            if (scope.isValid = dimIsValid(newval)) {
              scope.externalModel = convertToDimString(newval);
            }
          }, true);
        }

        function handlePrimitiveValue () {
          setInternal_primitive();

          internalValueWatcher = scope.$watch('dim.internal', function (newval) {
            if (scope.isValid = primitiveIsValid(newval)) {
              scope.externalModel = newval;
            }
          }, true);
        }

        //checks + helpers

        function dimIsValid (dim) {
          return dim.value > 0 && dim.unit != '';
        }

        function convertToDimString (dim) {
          return dim.value + ':' + dim.unit;
        }

        function convertStringToDim (string) {
          if (!string) return;

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
