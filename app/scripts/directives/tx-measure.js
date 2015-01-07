'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txMeasure
 * @description
 * # txMeasure
 */
angular.module('transcripticApp')
  .directive('txMeasure', function (DimensionOptions) {
    return {
      templateUrl: 'views/tx-measure.html',
      require: 'ngModel',
      restrict: 'E',
      scope: {
        dimensionType: '@' //todo - use single-binding
      },
      link: function postLink(scope, element, attrs, ngModel) {
        scope.options = DimensionOptions[scope.dimensionType];

        scope.dim = {
          value: 0,
          unit: scope.options[0]
        };

        function dimIsValid () {
          return scope.dim.value > -1 && scope.dim.unit != '';
        }

        function convertToDimString () {
          return scope.dim.value + ':' + scope.dim.unit;
        }

        scope.$watch('dim', function () {
          dimIsValid() && ngModel.$setViewValue(convertToDimString());
        }, true);
      }
    };
  });
