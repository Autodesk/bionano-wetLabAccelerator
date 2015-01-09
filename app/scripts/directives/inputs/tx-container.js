'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txContainer
 * @description
 * # txContainer
 */
//todo - combine with Ref stanza?? (allowing for new container + handling diff model)
angular.module('transcripticApp')
  .directive('txContainer', function (Container, ContainerOptions) {
    return {
      templateUrl: 'views/tx-container.html',
      require: 'ngModel',
      restrict: 'E',
      scope: {
        internalModel: '=ngModel',
        refs: '='
      },
      link: function postLink(scope, element, attrs, ngModel) {

        scope.updateModel = function () {
          ngModel.$setViewValue(scope.internalModel);
        };

        scope.containers = Container.list();
        scope.containerOptions = ContainerOptions;
      }
    };
  });
