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
      restrict        : 'E',
      require         : 'ngModel',
      scope           : {
        model: '=ngModel',
        field: '='
      },
      bindToController: true,
      controllerAs    : 'fieldCtrl',
      controller      : function ($scope, $element, $attrs) {
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
              well     : well
            };
          });
        };
      },
      compile         : function compile (tElement, tAttrs, transclude) {
        return {
          pre : function preLink (scope, iElement, iAttrs) {
            var type      = _.result(scope.fieldCtrl.field, 'type'),
                inputType = Omniprotocol.inputTypes[type],
                partial   = type;                 //default, maybe handled differently in if/else

            //Special handling before we get the appropriate template

            //handle all dimensional values the same way
            // todo - should check this better... not bake in for autoprotocol
            if (_.result(inputType, 'autoprotocol-type') == 'Unit') {
              partial           = 'dimension';
              scope.unitOptions = inputType.units;

              //todo - handle restrictions

            }
            else if (type == 'option') {
              scope.modelOptions = scope.fieldCtrl.field.options;
            }
            else if (type == 'aliquot') {
              scope.aliquotMultiple = false;
            }
            else if (type == 'aliquot+') {
              partial               = 'aliquot';
              scope.aliquotMultiple = true;
            }
            else if (type == 'thermocycleDyes') {
              scope.fieldCtrl.dyesContainer = {}; //todo - finish this
            }

            /* functions for specific types */

            /* get the partial */

            return $http.get('views/inputs/' + partial + '.html').then(function (data) {
              var $el = angular.element(data.data);
              iElement.html($compile($el)(scope));
              //todo - add inputAttrs e.g. for dimensional
            });
          },
          post: function postLink (scope, iElement, iAttrs, ngModel) {

          }
        }
      }
    };
  });
