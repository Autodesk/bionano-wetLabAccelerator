'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.RefFactory
 * @description
 * # RefFactory
 * Factory in the transcripticApp.
 */
angular.module('transcripticApp').factory('RefFactory', function (StorageOptions) {

  var discardKey = "DISCARD";
  var storageOptions = StorageOptions.storage;

  function Ref (initial) {

    var self = this;

    (!_.isEmpty(initial) && Ref.prototype.isValid.call(initial)) && _.extend(this, initial);

    //use getterSetters this way to play nice with angular, rather than real get / set functions
    this.isNew = function (newval) {
      if (angular.isDefined(newval)) {
        self.changeReference(!!newval, '')
      }
      return angular.isDefined(self.new) && !angular.isDefined(self.id);
    };

    this.toStore = function (newval) {
      if (angular.isDefined(newval)) {
        !!newval ? self.changeStorage(storageOptions[0]) : self.changeStorage(discardKey)
      }
      return angular.isDefined(self.store) && self.discard !== true;
    };
  }

  Ref.prototype.isValid = function () {
    return (this.id || this.new) &&
      (this.discard === true || (this.store && this.store.where));
  };

  Ref.prototype.changeStorage = function (storageOpt) {
    if (storageOpt == discardKey) {
      delete this.store;
      this.discard = true;
    } else if (storageOptions.indexOf(storageOpt) > -1) {
      delete this.discard;
      this.store = {where: storageOpt};
    } else {
      console.error('invalid storage option', storageOpt);
    }
  };

  Ref.prototype.changeReference = function (isNew, newRef) {
    console.assert(_.isString(newRef), 'new reference is not a string');
    if (isNew) {
      delete this.id;
      this.new = newRef;
    } else {
      delete this.new;
      this.id = newRef;
    }
  };

  Ref.prototype.getDiscardKey = function () {
    return discardKey;
  };

  return Ref;
});
