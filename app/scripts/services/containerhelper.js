'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ContainerHelper
 * @description
 * # ContainerHelper
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ContainerHelper', function (Auth, Container) {
    var self = this;

    self.local  = [];
    self.remote = [];

    self.containers = [];

    Auth.watch(function (info) {
      !!info && Container.list().$promise.then(self.setRemote);
    });

    //todo - need to get remote and local into same format

    self.setRemote = function (remote) {
      self.remote.length = 0;
      _.forEach(remote, function (cont) {
        self.remote.push({
          id   : cont.id,
          isNew: false,
          type : cont.container_type.shortname,
          name : cont.label
        });
      });
      console.log(remote, self.remote);
    };

    self.setLocal = function (local) {
      self.local.length = 0;
      _.forEach(local, function (cont) {
        self.local.push(cont);
      });
      console.log(self.local);
    };

    self.getContainer = function (name) {
      return _.find(self.containers, function (cont) {
        return _.result(cont.metadata, 'name') == id;
      });
    };

    // helpers

    //for setting local or remote - will update union
    function assignContainers (array, containers) {
      array.length = 0;
      _.forEach(containers, function (cont) {
        array.push(cont);
      });
      assignUnion(_.union(self.local, self.remote));
    }

    function assignUnion () {
      var union = _.union(self.local, self.remote);
      self.containers.length = 0;
      _.forEach(union, function (cont) {
        self.containers.push(cont);
      });
      return self.containers;
    }

    return self;
  });