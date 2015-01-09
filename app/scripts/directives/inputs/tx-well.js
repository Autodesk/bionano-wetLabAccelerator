'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txWell
 * @description
 * Directive for specifying a well, and potentially a container
 *
 * - 4 scenarios supported -
 * no container, one well
 * no container, multiple wells
 * specify container, one well
 * specify container, multiple wells -- get array in form [ {well : "<container>/<well>" }]
 *
 * if need to specify container, must pass specifyContainer and refs
 *
 */
//note - weird backspace behavior because of ng-list... may want to smooth out
//todo - add required flags
//todo - validation (and therefore passage of container)
//todo - alphanumeric <--> numeric conversion
angular.module('transcripticApp')
  .directive('txWell', function () {

    var containerWellJoiner = '/';

    function joinContainerWell(container, well) {
      return container + containerWellJoiner + well;
    }

    function splitContainerWell(str) {
      return str.split(containerWellJoiner);
    }

    function parseContainerWell (str) {
      //i.e. scope.multiple
      if (angular.isArray(str)) {
        return {
          wells: str
        }
      }
      //i.e. !scope.multiple
      else if (angular.isString(str)) {
        var split = splitContainerWell(str);

        if (split.length == 2) {
          return {
            container : split[0],
            wells : [split[1]]
          }
        } else {
          return {
            wells : [split[0]]
          }
        }
      }
      //undefined, or something weird
      else {
        return {}
      }
    }

    //todo - checks to make sure all same container + otherFields
    function parseContainerWellObjects (input, otherFields) {
      var wells = [],
          container,
          otherKeys = Object.keys(otherFields),
          otherValues = {};

      input.forEach(function (wellObj, index) {
        var split = splitContainerWell(wellObj.well);

        if (index == 0) {
          container = split[0];
          otherKeys.forEach(function (key) {
            if (wellObj[key]) {
              otherValues[key] = wellObj[key]
            }
          });
        }

        wells.push(split[1]);
      });

      return {
        internal : {
          wells: wells,
          container: container
        },
        meta: otherValues
      }
    }

    function multipleWellsToObjects (container, wells, alsoZip) {
      return _.map(wells, function (well) {
        return _.extend({well : joinContainerWell(container, well)}, alsoZip);
      });
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
        multipleZip: '=', //if multiple and specifyContainer, other fields to include in array. MUST BE ASSIGNABLE (i.e. single object)
        refs: '=?'
      },
      link: function postLink(scope, element, attrs, ngModel) {

        //set up inheritance
        scope.internal = {};

        //deep watch, propagate up changes
        scope.$watch('internal', function (newval) {
          if (angular.isUndefined(newval.wells) || newval.wells.length == 0) return;

          //set as an array
          if (scope.multiple) {
            if (scope.specifyContainer) {
              if (angular.isUndefined(newval.container)) return;
              ngModel.$setViewValue(multipleWellsToObjects(newval.container, newval.wells, scope.multipleZip));
            } else {
              ngModel.$setViewValue(newval.wells);
            }
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
          if (!newval) return;

          if (!!scope.multiple && !!scope.specifyContainer) {
            var parsed = parseContainerWellObjects(newval, scope.multipleZip);

            scope.internal = parsed.internal;
            angular.extend(scope.multipleZip, parsed.meta);
          } else {
            scope.internal = parseContainerWell(newval);
          }
        });

        scope.$watch('multipleZip', function (newval) {
          if (!newval) return;
          if (!scope.internal.container || !scope.internal.wells) return;

          ngModel.$setViewValue(multipleWellsToObjects(scope.internal.container, scope.internal.wells, newval));
        }, true);
      }
    }
  });
