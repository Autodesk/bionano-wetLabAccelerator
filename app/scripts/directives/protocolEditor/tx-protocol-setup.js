'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolSetup
 * @description
 * # txProtocolSetup
 */
angular.module('transcripticApp')
  .directive('txProtocolSetup', function (Auth, Container, Omniprotocol) {
    return {
      templateUrl: 'views/tx-protocol-setup.html',
      restrict: 'E',
      scope: {
        parameters: '='
      },
      bindToController: true,
      controllerAs: 'setupCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        this.paramTypes = Omniprotocol.inputTypes;
        this.containerOptions = Omniprotocol.optionEnums.containers;
        this.storageOptions = _.union([false], Omniprotocol.optionEnums.storage.storage);

        //todo - write abstraction for inventory, and use instead of this
        Auth.watch(function () {
          self.availableContainers = Container.list();
        });

        this.addParam = function () {
          this.parameters.push({});
        }.bind(this);

        this.clearParamValue = function (param) {
          param.value = null;
        };

        self.deleteParam = function (param) {
          _.remove(self.parameters, param);
        };
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
