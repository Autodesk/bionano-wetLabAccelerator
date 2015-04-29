'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ContainerHelper
 * @description
 * # ContainerHelper
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ContainerHelper', function ($rootScope, Auth, Container) {
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
        cont = _.isObject(cont.container) ? cont.container : cont; //test mode is different
        self.remote.push({
          id   : _.result(cont, 'id'),
          isNew: false,
          type : _.result(_.result(cont, 'container_type'), 'shortname'),
          name : _.result(cont, 'label')
        });
      });
    };

    self.setLocal = function (local) {
      self.local.length = 0;
      _.forEach(local, function (cont) {
        self.local.push(cont);
      });
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