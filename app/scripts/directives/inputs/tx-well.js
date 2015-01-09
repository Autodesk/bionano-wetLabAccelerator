'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txWell
 * @description
 * Directive for specifying a well, and potentially a container
 *
 * - 3 scenarios supported -
 * no container, one well
 * no container, multiple wells
 * specify container, one well
 * specify container, multiple wells -- NOT SUPPORTED. Should specify differently in UI
 *
 * if need to specify container, must pass specifyContainer and refs
 *
 */
//todo - add required flags
angular.module('transcripticApp')
  .directive('txWell', function () {

    var containerWellJoiner = '/';

    function joinContainerWell(container, well) {
      return container + containerWellJoiner + well;
    }

    function parseContainerWell (str) {
      if (angular.isArray(str)) {
        return {
          wells: str
        }
      } else if (angular.isString(str)) {
        var split = str.split(containerWellJoiner);

        if (split.length == 2) {
          return {
            container : split[0],
            wells : split[1]
          }
        } else {
          return {
            wells : split[0]
          }
        }
      } else {
        return {}
      }
    }

    return {
      templateUrl: 'views/tx-well.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        externalModel: '=ngModel',
        label: '@',
        multiple: '@',
        specifyContainer: '@',
        refs: '=?'
      },
      link: function postLink(scope, element, attrs, ngModel) {

        //set up inheritance
        scope.internal = {};

        //deep watch, propagate up changes
        scope.$watch('internal', function (newval) {
          console.log(newval);

          if (angular.isUndefined(newval.wells) || newval.wells.length == 0) return;

          ngModel.$setValidity('multiple', (scope.multiple && !scope.specifyContainer) || newval.wells.length == 1);

          //set as an array
          if (scope.multiple) {
            ngModel.$setViewValue(newval.wells);
          }
          //set as a string, with container if appropriate
          else {
            var singleWell = newval.wells[0];
            if (scope.specifyContainer) {
              if (angular.isUndefined(newval.container)) return;
              ngModel.$setViewValue(joinContainerWell(newval.container, singleWell));
            } else {
              ngModel.$setViewValue(singleWell);
            }
          }
        }, true);

        scope.$watch('externalModel', function (newval) {
          scope.internal = parseContainerWell(newval);
        });
      }
    }
  });
