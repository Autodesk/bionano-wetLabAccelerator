'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolInput
 * @description
 * # txProtocolInput
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolField', function ($http, $compile, Omniprotocol, Autoprotocol) {
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
            var type    = _.result(scope.fieldCtrl.field, 'type'),
                partial = type;                 //default, maybe handled differently in if/else

            //Special handling before we get the appropriate template

            //handle all dimensional values the same way
            // todo - should check this better... not bake in for autoprotocol
            if (_.contains(Autoprotocol.utils.dimensionalFields, type)) {

              var inputType     = Omniprotocol.inputTypes[type];
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

            /* functions for specific types */

            /* get the partial */

            return $http.get('views/inputs/' + partial + '.html').then(function (data) {
              var $el = angular.element(data.data);
              iElement.html($compile($el)(scope));
            });
          },
          post: function postLink (scope, iElement, iAttrs, ngModel) {
            //if dimensional, ensure that unit is defined when changed
            //kinda a hack, but nice guarantee and easier than lots of object passing in conversion later
            if (_.contains(Autoprotocol.utils.dimensionalFields, _.result(scope.fieldCtrl.field, 'type'))) {
              if (_.isUndefined(_.result(scope.fieldCtrl.model, 'unit'))) {
                var listener = scope.$watch('fieldCtrl.model', function (newval) {
                  console.log(newval);
                  if (_.isObject(newval) && (newval.value || newval.unit) ) {
                    var defaultUnit = _.result(_.result(scope.fieldCtrl.field, 'default'), 'unit') || scope.unitOptions[0];
                    ngModel.$setViewValue(_.assign({unit : defaultUnit}, scope.fieldCtrl.model));
                    listener();
                  }
                }, true);
              }
            }
          }
        }
      }
    };
  });
