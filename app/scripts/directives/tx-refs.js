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

        var discardKey = "DISCARD";
        scope.discardKey = discardKey;

        scope.containers = Container.list();
        scope.containerOptions = ContainerOptions;
        scope.storageOptions = [discardKey].concat(StorageOptions.storage);

        scope.addRef = function () {
          scope.refs["myRef"] = {};
        };

        scope.removeRef = function (key) {
          delete scope.refs[key];
        };

        scope.changeRefKey = function (newkey, oldkey) {
          scope.refs[newkey] = angular.copy(scope.refs[oldkey]);
          delete scope.refs[oldkey];
        };

        scope.changeStorage = function (ref, storageOpt) {
          if (storageOpt == discardKey) {
            delete ref.store;
            ref.discard = true;
          } else if (StorageOptions.storage.indexOf(storageOpt) > -1) {
            delete ref.discard;
            ref.store = {where: storageOpt};
          } else {
            console.error('invalid storage option', storageOpt);
          }
        };

        scope.changeReference = function (ref, isNew, newRef) {
          console.assert(_.isString(newRef), 'new reference is not a string');
          if (isNew) {
            delete ref.id;
            ref.new = newRef;
          } else {
            delete ref.new;
            ref.id = newRef;
          }
        };

        scope.refIsNew = function (ref, newval) {
          if (angular.isDefined(newval)) {
            scope.changeReference(ref, !!newval, '')
          }
          return angular.isDefined(ref.new) && !angular.isDefined(ref.id);
        };

        scope.refIsValid = function (ref) {
          return (ref.id || ref.new) &&
            (ref.discard === true || (ref.store && ref.store.where));
        };
      }
    };
  });
