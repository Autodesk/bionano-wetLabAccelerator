'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolParameters
 * @description
 * # txProtocolParameters
 * //todo - need to verify value is correct given the type... use tx-protocol-field?
 */
angular.module('transcripticApp')
  .directive('txProtocolParameters', function (InputTypes) {
    return {
      templateUrl: 'views/tx-protocol-parameters.html',
      restrict : 'E',
      scope : {
        parameters: '='
      },
      bindToController: true,
      controllerAs : 'paramsCtrl',
      controller : function ($scope, $element, $attrs) {
        var self = this;

        self.inputOptions = _.keys(InputTypes);

        self.addParameter = function () {
          //todo - ensure no duplicates
          $scope.paramsCtrl.parameters.push({
            name : "myParam"
          });
        };
      },
      link : function (scope, element, attrs) {

      }
    }
  });
