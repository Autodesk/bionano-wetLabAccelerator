'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolInput
 * @description
 * # txProtocolInput
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolField', function ($http, $compile, Omniprotocol) {
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
          //view guarantees that containerName is set.. but should be able to handle when container already specified (todo - make sure can't specify well outside of an aliquot)
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
                inputType = Omniprotocol.inputTypes[type],
                partial = type;                 //default, maybe handled differently in if/else

            //Special handling before we get the appropriate template

            //handle all dimensional values the same way
            if (inputType['autoprotocol-type'] == 'Unit') {
              partial = 'dimension';
              scope.unitOptions = inputType.units;

              var initialModel = _.isEmpty(scope.fieldCtrl.model) ?
                                   scope.fieldCtrl.model :
                                   ( scope.fieldCtrl.field.optional ? scope.fieldCtrl.field.default : null );

              scope.placeholder = convertDimensionalExternal(scope.fieldCtrl.field.default);

              handleNewDimensionalExternal(initialModel);
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
              scope.internal = convertDimensionalExternal(newval);
            }

            function convertDimensionalExternal (val) {
              if (!_.isString(val)) { return null; }
              var split = val.split(':');
              return {
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
