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

    this.prototype.isValid.call(initial) && _.extend(this, initial);

    Object.defineProperties(this, {
      isNew : {
        get: function () {
          return _.isDefined(self.new) && !self.id;
        }
      },
      toStore: {
        get: function () {
          return _.isDefined(self.store) && self.discard !== true;
        }
      }
    });
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
    this.isNew = !!isNew;
    if (this.isNew) {
      delete this.id;
      this.new = newRef;
    } else {
      delete this.new;
      this.id = newRef;
    }
  };

  return Ref;
});
