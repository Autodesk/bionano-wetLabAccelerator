'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolActions
 * @description
 * # txProtocolActions
 */
angular.module('transcripticApp')
  .directive('txProtocolActions', function (Autoprotocol) {
    return {
      templateUrl: 'views/tx-protocol-actions.html',
      restrict: 'E',
      scope: {
        protocol: '=',
        protocolForm: '='
      },
      bindToController: true,
      controllerAs: 'actionCtrl',
      controller: function ($scope, $element, $attrs) {
        //todo - all actions needed from protocolCtrl
        var self = this;

        self.logAutoprotocol = function () {
          console.log(angular.toJson(Autoprotocol.fromAbstraction(self.protocol), true));
        }
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
