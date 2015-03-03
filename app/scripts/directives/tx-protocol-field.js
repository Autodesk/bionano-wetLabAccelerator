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

      },
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          pre: function preLink(scope, iElement, iAttrs) {
            var type = scope.fieldCtrl.field.type,
                inputType = InputTypes[type],
                partial;

            console.log(type);

            if (inputType['autoprotocol-type'] == 'Unit') {
              partial = 'dimension';
              scope.unitOptions = inputType.units;
              var split = scope.fieldCtrl.model.split(':');
              //todo - $watch
              scope.internal = {
                value: parseInt(split[0], 10),
                unit: split[1]
              };
            }
            else if (type == 'option') {
              partial = 'option';
              scope.modelOptions = scope.fieldCtrl.field.options;
            }
            else {
              partial = type;
            }

            return $http.get('views/inputs/' + partial + '.html').then(function (data) {
              iElement.html($compile(angular.element(data.data))(scope));
            });
          },
          post: function postLink(scope, iElement, iAttrs, ngModel) {
            console.log('post_link');
          }
        }
      }
    };
  });
