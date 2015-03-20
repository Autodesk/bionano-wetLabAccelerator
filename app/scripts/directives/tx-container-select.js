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
      template: '<select ng-model="internalModel" ng-options="o as o.name for o in containerSelectCtrl.containers"></select>',
      restrict: 'E',
      scope: {
        //containers: '=',
        type: '=containerType',
        model: '=ngModel'
      },
      bindToController: true,
      controllerAs: 'containerSelectCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this;

        self.selectType = angular.isDefined($attrs.selectType);

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

        self.containers = _.union(currentParent.editorCtrl.protocol.references, _.filter(currentParent.editorCtrl.protocol.parameters, function (param) {return param.type == 'container'} ));
      },
      link: function postLink(scope, element, attrs) {

        scope.$watch('internalModel', function (newval) {
          if (_.isEmpty(newval)) { return; }
          scope.containerSelectCtrl.model = newval.name;
          scope.containerSelectCtrl.type = newval.type; // todo - guarantee this exists (e.g. non-new ref, parameter)
        }, true)

      }
    };
  });
