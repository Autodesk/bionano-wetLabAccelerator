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
      template: '<select ng-model="containerSelectCtrl.model" ng-options="o.name as o.name for o in containerSelectCtrl.containers" ng-change="containerSelectCtrl.handleChange()"></select>',
      restrict: 'E',
      scope: {
        //containers: '=',
        type: '=?containerType',
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
          if (_.has(currentParent, 'editorCtrl')) {
            break;
          }
          currentParent = currentParent.$parent;
        }

        // union of references and parameters, but with parameter referencing the reference (just with another name)
        self.containers = _.filter(currentParent.editorCtrl.protocol.parameters, _.matches( {type : 'container'} ));

        //expose changes to container-type
        //todo - need to handle containers which are not new
        self.handleChange = function () {
          var index = _.findIndex(self.containers, function (container) {
            return container.name == self.model;
          }),
          containerValue = _.result(self.containers[index], 'value');

          self.type = _.result(containerValue, 'type');
        };
      },
      link: function postLink(scope, element, attrs) {}
    };
  });
