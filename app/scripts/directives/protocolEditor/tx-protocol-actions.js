'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolActions
 * @description
 * # txProtocolActions
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolActions', function ($rootScope, Omniprotocol) {
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
        var self = this;

        self.clearProtocol = function () {
          _.assign(self.protocol, Omniprotocol.utils.getScaffoldProtocol());
        };

        $scope.modalShown = false;
        $scope.toggleModal = function() {
          $scope.modalShown = !$scope.modalShown;
        };

        self.allStepsOpen = false;
        self.toggleAllSteps = function () {
          self.allStepsOpen = !self.allStepsOpen;
          $rootScope.$broadcast('editor:toggleGroupVisibility', self.allStepsOpen);
        };
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
