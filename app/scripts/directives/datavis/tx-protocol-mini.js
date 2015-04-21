'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolMini
 * @description
 * # txProtocolMini
 */
angular.module('transcripticApp')
  .directive('txProtocolMini', function () {
    return {
      templateUrl: 'views/datavis/tx-protocol-mini.html',
      restrict: 'E',
      scope: {
        protocol : '=',
        currentOperation: '=',
        showTimelines: '='
      },
      bindToController: true,
      controllerAs : 'miniCtrl',
      controller: function protocolMiniController($scope, $element, $attrs) {},
      link: function postLink(scope, element, attrs) {}
    };
  });
