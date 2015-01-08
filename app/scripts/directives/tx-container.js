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
      link: function postLink(scope, element, attrs, ngModel) {

        scope.containers = Container.list();
        scope.containerOptions = ContainerOptions;

        scope.setModel = ngModel.$setViewValue;
      }
    };
  });
