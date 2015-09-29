'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txProtocolInput
 * @description
 * # txProtocolInput
 *
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolField', function ($http, $compile, $timeout, Omniprotocol, Autoprotocol, ProtocolHelper, ProtocolUtils, UUIDGen) {
    return {
      templateUrl     : 'views/tx-protocol-field.html',
      restrict        : 'E',
      require         : ['ngModel', '^?txProtocolOp'], // won't have opCtrl if setup, or standalone, etc.
      scope           : {
        model          : '=ngModel',
        field          : '=',
        preventVariable: '=',
        hideTitle      : '=',
        hideUnit       : '=?' //for dimensionals
      },
      bindToController: true,
      controllerAs    : 'fieldCtrl',
      controller      : function ($scope, $element, $attrs) {
        var self = this;

        //limit toggling of parameters to fields which support it
        var parameterizables = _.keys(_.pick(Omniprotocol.inputTypes, _.matches({canParameterize: true})));

        self.parameterAllowed = function parameterAllowed (fieldType) {
          return _.indexOf(parameterizables, fieldType) >= 0;
        };

        //fixme - verify by loading in a new protocol
        //this binding may break... if in view only, angular will handle...
        self.parameters = ProtocolHelper.currentProtocol.parameters;

        self.selectParameter = function (param, event) {
          self.field.parameter     = param.id;
          //initially set the model to the parameter
          self.model               = _.cloneDeep(param.value);
        };

        self.createNewParameter = function () {
          var param = ProtocolUtils.createParameter({
            type: self.field.type,
            value: _.isUndefined(self.model) ?
              _.cloneDeep(self.field.default) :
              _.cloneDeep(self.model)
          });

          self.selectParameter(param);
        };

        self.clearParameter = function () {
          //assign current value
          var paramId = self.field.parameter;
          paramId && $scope.assignFieldValue(ProtocolUtils.paramValueFromParamId(paramId));

          //clear parameter from field
          delete self.field.parameter;
        };

        self.isParameterized = function () {
          return !!self.field.parameter;
        };

        self.paramName = function () {
          return ProtocolUtils.paramNameFromParamId(self.field.parameter);
        };

        //only avilable after link
        self.assignFieldValue = $scope.assignFieldValue;

        //dropdown

        var hideDropDown;

        self.closeDropdown = function () {
          hideDropDown = $timeout(function () {
            self.paramListVisible = false;
          }, 1500);
        };

        self.cancelDropdown = function () {
          $timeout.cancel(hideDropDown);
        };

      },
      compile         : function compile (tElement, tAttrs, transclude) {
        var type,
            partial;
        return {
          pre : function preLink (scope, iElement, iAttrs) {
            type    = _.result(scope.fieldCtrl.field, 'type');
            partial = type;                 //default, maybe handled differently in if/else

            //Special handling before we get the appropriate template

            // handle all dimensional values the same way
            if (Omniprotocol.inputTypes[type].category == 'dimensional') {

              var inputType     = Omniprotocol.inputTypes[type];
              partial           = 'dimension';
              scope.unitOptions = inputType.units;

              //todo - handle restrictions

            }
            else if (type == 'option') {
              scope.modelOptions = _.uniq(scope.fieldCtrl.field.options);
            }
            else if (_.startsWith(type, 'aliquot')) {
              partial = 'aliquot';
            }

            /* functions for specific types */

            /* get the partial */

            //hack - special hiding for dataref
            if (_.result(scope.fieldCtrl.field, 'name') == 'dataref') {
              iElement.remove();
            }

            return $http.get('views/inputs/' + partial + '.html', {cache: true}).then(function (data) {
              var $el = angular.element(data.data);
              iElement.find('tx-protocol-field-inner').html($compile($el)(scope));
            });
          },
          post: function postLink (scope, iElement, iAttrs, controllers) {

            var ngModel = controllers[0],
                opCtrl  = controllers[1];

            scope.hasOpCtrl = !_.isUndefined(opCtrl);
            scope.opCtrl    = opCtrl;

            scope.assignFieldValue = function (value, clearParameter) {
              if (clearParameter === true) {
                scope.fieldCtrl.clearParameter();
              }
              ngModel.$setViewValue(value);
            };

            //have dimensional here instead of own conroller because needs ngModel controller
            //if dimensional, ensure that unit is defined when changed
            //kinda a hack, but nice guarantee and easier than lots of object passing in conversion later
            if (partial == 'dimension') {
              if (_.isUndefined(_.result(scope.fieldCtrl.model, 'unit'))) {
                var listener = scope.$watch('fieldCtrl.model', function (newval) {

                  if (_.isObject(newval) && (_.isNumber(newval.value) || newval.unit)) {
                    var defaultUnit = _.result(_.result(scope.fieldCtrl.field, 'default'), 'unit') || scope.unitOptions[0];
                    ngModel.$setViewValue(_.assign({unit: defaultUnit}, scope.fieldCtrl.model));
                    listener();
                  }
                }, true);
              }
            }

            //handle parameter as input, assign current value
            var paramId = scope.fieldCtrl.field.parameter;
            if (paramId) {
              scope.fieldCtrl.selectParameter(ProtocolUtils.paramById(paramId));
            }

          }
        }
      }
    };
  });
