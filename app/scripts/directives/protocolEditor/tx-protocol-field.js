'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolInput
 * @description
 * # txProtocolInput
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolField', function ($http, $compile, $timeout, Omniprotocol, Autoprotocol) {
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
          //view guarantees that containerName is set given a change in wells (tx-plate)

          var mapped = _.map(wells, function (well) {
            return {
              container: self.containerName,
              well     : well
            };
          });

          if (self.singleContainer === false) {
            self.model = _.union(
              _.reject(self.model, _.matches({container : self.containerName})),
              mapped
            );
          } else {
            self.model = mapped;
          }

          // todo - check if triggers new digest
          self.wellsIn = wells;
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
              iElement.html($compile($el)(scope));
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

              scope.$watch('fieldCtrl.containerName', function (newContainer) {
                //don't need to worry about setting wells here - change listener for wellsOut will handle whether dealing with single container
                setWellsInput(pruneWellsFromContainer(newContainer));
              });
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
