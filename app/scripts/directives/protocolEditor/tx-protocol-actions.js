'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolActions
 * @description
 * # txProtocolActions
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolActions', function ($rootScope, ProtocolHelper, Omniprotocol) {
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

        self.clearProtocol = _.partial(ProtocolHelper.clearProtocol, self.protocol);
        self.saveProtocol = function () {
          ProtocolHelper.saveProtocol(self.protocol)
            .then(self.protocolForm.$setPristine);
        };

        $scope.modalShown = false;
        $scope.toggleModal = function() {
          $scope.modalShown = !$scope.modalShown;
        };

        self.autoprotocolConvertFunction = ProtocolHelper.convertToAutoprotocol;

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
