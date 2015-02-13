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
        protocols: '='
      },
      controllerAs: 'sliderCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        self.selectProtocol = function (p) {
          console.log(p);
        }
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
