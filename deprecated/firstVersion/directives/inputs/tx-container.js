'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txContainer
 * @description
 * # txContainer
 */
//todo - combine with Ref stanza?? (allowing for new container + handling diff model)
angular.module('wetLabAccelerator')
  .directive('txContainer', function (Container, ContainerOptions, Auth) {
    return {
      templateUrl: 'views/tx-container.html',
      require: 'ngModel',
      restrict: 'E',
      scope: {
        internalModel: '=ngModel',
        refs: '='
      },
      link: function postLink(scope, element, attrs, ngModel) {

        scope.updateModel = function (forceVal) {
          ngModel.$setViewValue(forceVal || scope.internalModel);
        };

        Auth.watch(function () {
          scope.containers = Container.list();
        });
        scope.containerOptions = ContainerOptions;

        scope.$on('protocol:refKeyChange', function (event, oldkey, newkey) {
          if (scope.internalModel == oldkey) {
            scope.updateModel(newkey);
          }
        });
      }
    };
  });
