'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txContainerSelect
 * @description
 * # txContainerSelect
 */
angular.module('transcripticApp')
  .directive('txContainerSelect', function () {
    return {
      template: '<select ng-model="containerSelectCtrl.model" ng-options="o.name as o.name for o in containerSelectCtrl.containers"></select>',
      restrict: 'E',
      scope: {
        //containers: '=',
        model: '=ngModel'
      },
      bindToController: true,
      controllerAs: 'containerSelectCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        //todo - how to get controllers this deep in the tree - can't require the controller for some reason?
        //fixme THIS IS THE UGLIEST HACK EVER
        var currentParent = $scope.$parent;
        while (!_.isUndefined(currentParent)) {
          console.log(currentParent);
          if (_.has(currentParent, 'editorCtrl')) {
            break;
          }
          currentParent = currentParent.$parent;
        }
        self.containers = currentParent.editorCtrl.protocol.references;

      },
      link: function postLink(scope, element, attrs) {}
    };
  });
