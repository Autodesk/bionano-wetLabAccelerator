'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolEditor
 * @description
 * # txProtocolEditor
 */

angular.module('transcripticApp')
  .directive('txProtocolEditor', function () {
    return {
      templateUrl: 'views/tx-protocol-editor.html',
      restrict: 'E',
      require: 'form', //todo - register controllers of instruction with form
      scope: {
        protocol: '='
      },
      bindToController: true,
      controllerAs: 'editorCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        self.groupSortableOptions = {
          axis: 'y',
          scroll: true,
          handle: '.protocol-group-header'
        };
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
