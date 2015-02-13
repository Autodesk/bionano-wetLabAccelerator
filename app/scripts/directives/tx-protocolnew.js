'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolnew
 * @description
 * # txProtocolnew
 */
angular.module('transcripticApp')
  .directive('txProtocolnew', function () {
    return {
      templateUrl: 'views/tx-protocolnew.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
