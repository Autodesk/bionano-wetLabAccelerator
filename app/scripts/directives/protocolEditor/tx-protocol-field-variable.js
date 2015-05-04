'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolFieldVariable
 * @description
 * # txProtocolFieldVariable
 */
angular.module('transcripticApp')
  .directive('txProtocolFieldVariable', function (ProtocolHelper) {
    return {
      template: '<select ng-model="model" ng-options="p.name as p.name for p in params">',
      restrict: 'E',
      scope: {
        model : '=ngModel',
        field: '='
      },
      link: function postLink(scope, element, attrs) {

        scope.params = filterParameters(ProtocolHelper.currentProtocol.parameters);

        scope.$on('editor:parameterChange', function (e, params) {
          scope.params = filterParameters(params);
        });

        //note - need to watch field type??

        function filterParameters (params) {
          var fieldType = scope.field.type;
          return _.filter(params, _.matches({type : fieldType}))
        }
      }
    };
  });
