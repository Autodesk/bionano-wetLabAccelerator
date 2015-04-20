'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperation
 * @description
 * # txOperation
 *
 * todo - may want to get the scaffold and populate that way to handle unspecified fields?
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolOp', function () {
    return {
      templateUrl: 'views/tx-protocol-op.html',
      restrict: 'E',
      require: '^txProtocolGroup',
      scope: {
        op: '=protocolStep'
      },
      bindToController: true,
      controllerAs: 'opCtrl',
      controller: function ($scope, $element, $attrs) {

      },
      link: function (scope, element, attrs, groupCtrl) {

      }
    };
  });
