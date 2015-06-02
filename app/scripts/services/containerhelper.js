'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ContainerHelper
 * @description
 * # ContainerHelper
 * Service in the transcripticApp.
 *
 * //todo - merge in containerOptions, and expose functionality here
 */
angular.module('transcripticApp')
  .service('ContainerHelper', function ($rootScope, Auth, Container, ContainerOptions) {
    var self = this;

    self.local  = [];
    self.remote = [];

    self.containers = [];

    self.containerOptions = ContainerOptions;

    Auth.watch(function (info) {
      _.result(info, 'organization', false) && Container.list({per_page: 100}).$promise.then(self.setRemote);
    });

    self.setRemote = function (remote, noReset) {
      if (noReset !== false ) {
        self.remote.length = 0;
      }

      _.forEach(remote, function (cont) {
        cont = _.isObject(cont.container) ? cont.container : cont; //test mode is different
        self.remote.push({
          id   : _.result(cont, 'id'),
          isNew: false,
          type : _.result(cont, 'container_type.shortname'),
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

    self.definedColors = {
      'maraschino': '#c5535b',
      'tangerine' : '#f28500',
      'aqua'      : '#00FFFF',
      'moss'      : '#addfad',
      'cayenne'   : '#EC0704',
      'carnation' : '#FFA6C9',
      'lime'      : '#00FF00',
      'plum'      : '#DDA0DD'
    };

    self.randomColor = function () {
      return '#' + ('000000' + (Math.random() * 0xFFFFFF << 0).toString(16)).slice(-6);
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
      var union              = _.union(self.local, self.remote);
      self.containers.length = 0;
      _.forEach(union, function (cont) {
        self.containers.push(cont);
      });
      return self.containers;
    }

    return self;
  });
