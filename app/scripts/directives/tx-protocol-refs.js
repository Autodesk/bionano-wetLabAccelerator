'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolRefs
 * @description
 * # txProtocolRefs
 */
angular.module('transcripticApp')
  .directive('txProtocolRefs', function () {
    return {
      templateUrl: 'views/tx-protocol-refs.html',
      restrict : 'E',
      scope : {
        refs: '='
      },
      bindToController: true,
      controllerAs : 'refsCtrl',
      link: function postLink(scope, element, attrs) {
        element.text('todo - protocol refs directive');
      }
    };
  });
