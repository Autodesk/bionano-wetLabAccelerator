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

        self.handleAliquotSelection = function (wells) {
          //view guarantees that containerName is set given a change in wells (tx-plate)

          var mapped = _.map(wells, function (well) {
            return {
              container: self.containerName,
              well     : well
            };
          });

          if (self.singleContainer === false) {
            self.model = _.union(
              _.reject(self.model, _.matches({container: self.containerName})),
              mapped
            );
          } else {
            self.model = mapped;
          }

          // todo - perf - check if triggers new digest
          self.wellsIn = wells;
        };

        //limit toggling of parameters to fields which support it
        var parameterFreeFields = ['aliquot', 'aliquot+', 'thermocycleGroups'];

        self.parameterAllowed = function parameterAllowed (fieldType) {
          return _.indexOf(parameterFreeFields, fieldType) < 0;
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
                value: _.cloneDeep(self.model)
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

        //todo - set to parameter on input / init

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
            // future - should check this better... not bake in for autoprotocol
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
              scope.fieldCtrl.aliquotMultiple = false;
            }
            else if (type == 'aliquot+') {
              partial                         = 'aliquot';
              scope.fieldCtrl.aliquotMultiple = true;
            }

            /* functions for specific types */

            /* get the partial */

            return $http.get('views/inputs/' + partial + '.html', {cache: true}).then(function (data) {
              var $el = angular.element(data.data);
              iElement.find('tx-protocol-field-inner').html($compile($el)(scope));
            });
          },
          post: function postLink (scope, iElement, iAttrs, ngModel) {

            //todo - probably makes sense to make a controller for each one of these...

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


            if (partial == 'aliquot') {
              scope.fieldCtrl.singleContainer = _.result(scope.fieldCtrl.field, 'singleContainer');
              //todo - handle single container in view

              //this stuff is in post link because need model bound
              var model           = scope.fieldCtrl.model,
                  multiple        = scope.fieldCtrl.aliquotMultiple,
                  singleContainer = scope.fieldCtrl.singleContainer;

              // containerType will be handled by the directive, which knows about this mapping
              if (_.isArray(model) && model.length) {
                var firstContainer            = _.result(_.first(model), 'container');
                scope.fieldCtrl.containerName = firstContainer;
                setWellsInput(pruneWellsFromContainer(firstContainer));
              }

              //scope.$watch('fieldCtrl.wellsOut', scope.fieldCtrl.handleAliquotSelection);

              scope.$on('editor:parameterNameChange', function (event, oldName, newName) {
                //verify - may need to more explicitly make sure this runs after the $watch...
                _.forEach(scope.fieldCtrl.model, function (wellObj) {
                  if (wellObj.container == oldName) {
                    wellObj.container = newName;
                  }
                });
              });

              scope.$watch('fieldCtrl.containerName', function (newContainer) {
                //don't need to worry about setting wells here - change listener for wellsOut will handle whether dealing with single container
                setWellsInput(pruneWellsFromContainer(newContainer));
              });

              //todo - perf - optimize
              scope.$on('editor:parameterChange', function (e, newparams) {
                var cont = Omniprotocol.utils.getContainerFromName(newparams, scope.fieldCtrl.containerName);
                scope.fieldCtrl.containerColor = cont.value.color;
              })
            }

            //handle parameter as input
            if (scope.fieldCtrl.field.parameter) {
              var relevantParam = _.find(ProtocolHelper.currentProtocol.parameters, {name: scope.fieldCtrl.field.parameter});
              scope.fieldCtrl.selectParameter(relevantParam);
            }

            //so hack!
            //need to wait for tx-container-select to propagate type before setting input, because container will re-render and render selection empty
            function setWellsInput (wells) {
              var listener = scope.$watch('fieldCtrl.containerType', function (newval) {
                if (!!newval) {
                  scope.fieldCtrl.wellsIn = wells;
                  listener();
                }
              });
            }

            function pruneWellsFromContainer (container) {
              //use model directly to avoid object reference weirdness + ensure everything actually in sync
              return _.pluck(_.filter(scope.fieldCtrl.model, _.matches({container: container})), 'well');
            }
          }
        }
      }
    };
  });
