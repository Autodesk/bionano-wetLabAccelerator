'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolslider
 * @description
 * # txProtocolslider
 */
angular.module('transcripticApp')
  .directive('txProtocolslider', function () {
    return {
      templateUrl: 'views/tx-protocolslider.html',
      restrict: 'E',
      scope: {
        protocols: '=',
        protocolSelected: '='
      },
      controllerAs: 'sliderCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        self.selectProtocol = function (p) {
          $scope.protocolSelected = p;
        }
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
