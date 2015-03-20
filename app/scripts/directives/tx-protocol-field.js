'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolInput
 * @description
 * # txProtocolInput
 *
 * todo - need smarter logic for showing aliquot and aliquot+ -- how to inherit from protocol???
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
          //perhaps introduce a key "omit" (kinda different than hidden) which then gets stripped in conversion
        };

        self.handleAliquotSelection = function (wells) {
          console.log(self.containerType, self.containerName, wells);
          self.model = _.map(wells, function (well) {
            return {
              container: self.containerName,
              well : well
            };
          });
        };
      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, iElement, iAttrs) {
            var type = scope.fieldCtrl.field.type,
                inputType = InputTypes[type],
                partial = type;                 //default, maybe handled differently in if/else

            //Special handling before we get the appropriate template

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
            else if (type == 'aliquot') {
              scope.aliquotMultiple = false;
            }
            else if (type == 'aliquot+') {
              partial = 'aliquot';
              scope.aliquotMultiple = true;
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
              var $el = angular.element(data.data);
              iElement.html($compile($el)(scope));
              //todo - add inputAttrs e.g. for dimensional
            });
          },
          post: function postLink(scope, iElement, iAttrs, ngModel) {

          }
        }
      }
    };
  });
