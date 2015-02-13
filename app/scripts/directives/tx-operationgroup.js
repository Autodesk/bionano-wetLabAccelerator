'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperationgroup
 * @description
 * # txOperationgroup
 */
angular.module('transcripticApp')
  .directive('txOperationgroup', function () {
    return {
      templateUrl: 'views/tx-operationGroup.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
