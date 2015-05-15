'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolInput
 * @description
 * # txProtocolInput
 *
 * todo - can probably clean this up a lot using ProtocolHelper - containerType + containerName stuff is weird
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolField', function ($http, $compile, $timeout, Omniprotocol, Autoprotocol, ProtocolHelper) {
    return {
      templateUrl     : 'views/tx-protocol-field.html',
      restrict        : 'E',
      require         : 'ngModel',
      scope           : {
        model          : '=ngModel',
        field          : '=',
        preventVariable: '=',
        hideTitle      : '='
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

        self.parameters = ProtocolHelper.currentProtocol.parameters;

        var parameterListeners = [];

        self.selectParameter = function (param, event) {
          self.field.parameter = param.name;
          self.model           = _.cloneDeep(param.value);

          var parameterChangeListener = $scope.$on('editor:parameterChange', function (e, params) {
            var relevantParam = _.find(params, {name: self.field.parameter}),
                paramVal      = _.result(relevantParam, 'value');

            //check undefined in case name changed, then let other listener handle
            if (!_.isUndefined(paramVal)) {
              self.model = _.cloneDeep(paramVal);
            }
          });

          parameterListeners.push(parameterChangeListener);

          var parameterNameChangeListener = $scope.$on('editor:parameterNameChange', function (e, oldName, newName) {
            if (oldName == self.field.parameter) {
              self.field.parameter = newName;
            }
          });

          parameterListeners.push(parameterNameChangeListener);
        };

        self.createNewParameter = function () {
          var paramName = 'my_' + self.field.type,
              param     = {
                name : paramName,
                type : self.field.type,
                value: _.isUndefined(self.model) ? _.cloneDeep(self.field.default) : _.cloneDeep(self.model)
              };
          ProtocolHelper.currentProtocol.parameters.push(param);
          self.selectParameter(param);
        };

        self.clearParameter = function () {
          delete self.field.parameter;
          _.forEach(parameterListeners, function (listener) {
            _.isFunction(listener) && listener();
          });
        };

        var hideDropDown;

        self.closeDropdown = function () {
          hideDropDown = $timeout(function(){
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
            if (Omniprotocol.inputTypes[type].type == 'dimensional') {

              var inputType     = Omniprotocol.inputTypes[type];
              partial           = 'dimension';
              scope.unitOptions = inputType.units;

              //todo - handle restrictions

            }
            else if (type == 'option') {
              scope.modelOptions = _.uniq(scope.fieldCtrl.field.options);
            }
            else if (type == 'aliquot+') {
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
          post: function postLink (scope, iElement, iAttrs, ngModel) {

            //have dimensional here instead of own conroller because needs ngModel controller
            //if dimensional, ensure that unit is defined when changed
            //kinda a hack, but nice guarantee and easier than lots of object passing in conversion later
            if (partial == 'dimension') {
              if (_.isUndefined(_.result(scope.fieldCtrl.model, 'unit'))) {
                var listener = scope.$watch('fieldCtrl.model', function (newval) {

                  if (_.isObject(newval) && (newval.value || newval.unit)) {
                    var defaultUnit = _.result(_.result(scope.fieldCtrl.field, 'default'), 'unit') || scope.unitOptions[0];
                    ngModel.$setViewValue(_.assign({unit: defaultUnit}, scope.fieldCtrl.model));
                    listener();
                  }
                }, true);
              }
            }

            //handle parameter as input
            if (scope.fieldCtrl.field.parameter) {
              var relevantParam = _.find(ProtocolHelper.currentProtocol.parameters, {name: scope.fieldCtrl.field.parameter});
              scope.fieldCtrl.selectParameter(relevantParam);
            }

          }
        }
      }
    };
  });
