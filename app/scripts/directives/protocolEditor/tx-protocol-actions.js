'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolActions
 * @description
 * # txProtocolActions
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolActions', function ($rootScope, ProtocolHelper, Omniprotocol, Notify) {
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
          Notify({
            message: 'Protocol Saved',
            error: false
          });
        };

        $scope.modalShown = false;
        $scope.toggleModal = function() {
          $scope.modalShown = !$scope.modalShown;
        };

        self.autoprotocolConvertFunction = ProtocolHelper.convertToAutoprotocol;

      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
