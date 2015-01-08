'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txRefs
 * @description
 * # txRefs
 */
//todo - need to convert to Ref, probably internally to directive? or external as processing step?
angular.module('transcripticApp')
  .directive('txRefs', function (Container, ContainerOptions, StorageOptions, RefFactory) {
    return {
      templateUrl: 'views/tx-refs.html',
      restrict: 'E',
      scope: {
        refs: '='
      },
      link: function postLink(scope, element, attrs) {

        var discardKey = new RefFactory().getDiscardKey();
        scope.discardKey = discardKey;

        scope.containers = Container.list();
        scope.containerOptions = ContainerOptions;
        scope.storageOptions = [discardKey].concat(StorageOptions.storage);

        scope.addRef = function () {
          scope.refs["myRef"] = new RefFactory();
        };

        scope.changeRefKey = function (newkey, oldkey) {
          scope.refs[newkey] = angular.copy(scope.refs[oldkey]);
          delete scope.refs[oldkey];
        };
      }
    };
  });
