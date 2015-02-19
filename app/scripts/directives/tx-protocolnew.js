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
      scope: {
        protocol: '='
      },
      controllerAs: 'protocolCtrl',
      controller: function ($scope, $element, $attrs) {

      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
