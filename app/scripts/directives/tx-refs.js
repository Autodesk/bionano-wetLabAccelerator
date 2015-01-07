'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txRefs
 * @description
 * # txRefs
 */
angular.module('transcripticApp')
  .directive('txRefs', function (Container, ContainerOptions, StorageOptions) {
    return {
      templateUrl: 'views/tx-refs.html',
      restrict: 'E',
      scope: {
        refs: '='
      },
      link: function postLink(scope, element, attrs) {

        var discardKey = "DISCARD";
        scope.discardKey = discardKey;

        scope.containers = Container.list();
        scope.containerOptions = ContainerOptions;
        scope.storageOptions = [discardKey].concat(StorageOptions.storage);

        scope.refIsValid = function (ref) {
          return (ref.id || ref.new) && (ref.discard || (ref.store && ref.store.where));
        };

        scope.addRef = function () {
          scope.refs["myRef"] = {};
        };

        scope.changeStorage = function (ref, newval) {
          console.log('called storage', ref, newval, newval == discardKey);
          if (newval == discardKey) {
            delete ref.store;
            ref.discard = true;
          } else {
            delete ref.discard;
            ref.store = {where: newval};
          }
        };

        //todo - handle clicking new - remove ID or type respectively
        //todo - handle clicking discard - remove discard / store respectively

        scope.changeRefKey = function (newkey, oldkey) {
          scope.refs[newkey] = angular.copy(scope.refs[oldkey]);
          delete scope.refs[oldkey];
        };
      }
    };
  });
