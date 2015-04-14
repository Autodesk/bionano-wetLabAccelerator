'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolEditor
 * @description
 * # txProtocolEditor
 */

angular.module('tx.protocolEditor')
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
          handle: '.protocol-group-header',
          containment: '.protocol-instructions',
          tolerance: 'pointer'
        };

        self.duplicateGroup = function (group) {
          var index = _.indexOf(self.protocol.groups, group);
          self.protocol.groups.splice(index, 0, angular.copy(group));
        };

        self.deleteGroup = function (group) {
          _.remove(self.protocol.groups, group);
        };

      //todo - listen for parameters changing, propagate variable name throughout
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
