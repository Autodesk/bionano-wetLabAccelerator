'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolInput
 * @description
 * # txProtocolInput
 */
angular.module('transcripticApp')
  .directive('txProtocolField', function ($http, $compile, InputTypes) {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        model: '=ngModel',
        field: '='
      },
      bindToController: true,
      controllerAs: 'fieldCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        self.mixwrapToggle = function (newval) {
          //todo - handle mixwrap hidden / not hidden -- don't want to include in Autoprotocol if hidden
        }
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, iElement, iAttrs) {
            var type = scope.fieldCtrl.field.type,
                inputType = InputTypes[type],
                partial = type;                 //default, maybe handled differently in if/else

            //console.log(type);

            //handle all dimensional values the same way
            if (inputType['autoprotocol-type'] == 'Unit') {
              partial = 'dimension';
              scope.unitOptions = inputType.units;

              handleNewDimensionalExternal(scope.fieldCtrl.model);
              scope.$watch('internal', handleNewDimensionInternal, true);
              scope.$watch('fieldCtrl.model', handleNewDimensionalExternal);
            }
            else if (type == 'option') {
              scope.modelOptions = scope.fieldCtrl.field.options;
            }

            /* functions for specific types */

            function handleNewDimensionInternal (newobj) {
              //todo - assign using ngModelCtrl (need to do in postlink) - this works but not best way?
              if (_.isEmpty(newobj)) { return; }
              scope.fieldCtrl.model = '' + newobj.value + ':' + newobj.unit;
            }

            function handleNewDimensionalExternal (newval) {
              if (!_.isString(newval)) { return; }
              var split = newval.split(':');
              scope.internal = {
                value: parseInt(split[0], 10),
                unit: split[1]
              };
            }

            /* get the partial */

            return $http.get('views/inputs/' + partial + '.html').then(function (data) {
              iElement.html($compile(angular.element(data.data))(scope));
              //todo - add inputAttrs e.g. for dimensional
            });
          },
          post: function postLink(scope, iElement, iAttrs, ngModel) {

          }
        }
      }
    };
  });
