'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOrder
 * @description
 * # txOrder
 */
angular.module('transcripticApp')
  .directive('txOrder', function (OligoOptions) {
    return {
      templateUrl: 'views/tx-order.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        order: '=ngModel',
        orderType: '='
      },
      link: function (scope, element, attrs, ngModelCtrl) {
        //note hack - json-editor will reset json unless set in link b/c initially undefined
        scope.$watch('orderType', function (newval) {
          if (!!newval) {
            scope.order = {
              type: newval
            };
          }
        });

        scope.purityOptions = OligoOptions.purity;
        scope.scaleOptions = OligoOptions.scale;
      }
    };
  });
