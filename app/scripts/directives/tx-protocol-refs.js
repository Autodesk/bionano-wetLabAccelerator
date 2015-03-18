'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolRefs
 * @description
 * # txProtocolRefs
 */
angular.module('transcripticApp')
  .directive('txProtocolRefs', function (Auth, ContainerOptions, StorageOptions, Container) {
    return {
      templateUrl: 'views/tx-protocol-refs.html',
      restrict : 'E',
      scope : {
        refs: '=references'
      },
      bindToController: true,
      controllerAs : 'refsCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        self.typeOptions = ContainerOptions;

        self.storageOptions = _.union([false], StorageOptions.storage);

        //todo - write abstraction for inventory, and use instead of this
        Auth.watch(function () {
          self.availableContainers = Container.list();
        });


        self.addReference = function () {
          self.refs.push({});
        };
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  });
