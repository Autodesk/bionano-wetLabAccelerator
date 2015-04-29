'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ProtocolEditorHelper
 * @description
 * # ProtocolEditorHelper
 * Service in the transcripticApp.
 * todo - move away from firebase
 */
angular.module('transcripticApp')
  .service('ProtocolHelper', function ($q, simpleLogin, FBProfile, Omniprotocol, Autoprotocol) {

    var self = this;

    //make sure reference is preserved
    //is updated from firebase currently
    self.protocols = [];

    self.currentProtocol = {};

    self.assignCurrentProtocol = function (newProtocol) {
      _.assign(self.currentProtocol, Omniprotocol.utils.getScaffoldProtocol(), newProtocol);
    };

    self.addProtocol = function (inputProtocol) {
      var protocol = _.assign(Omniprotocol.utils.getScaffoldProtocol(), inputProtocol);

      //note - firebase
      self.firebaseProtocols.$add(protocol)
        .then(updateProtocolsExposed)
        .then(function () {
          return protocol;
        });
    };

    self.duplicateProtocol = function (protocol) {
      var dup = _.cloneDeep(protocol);

      //todo - smarter creation / update of metadata

      _.assign(dup.metadata, {
        id  : Math.floor(Math.random() * Math.pow(10, 12)),
        date: '' + (new Date()).valueOf()
      });

      //note - firebase
      return self.firebaseProtocols.$add(dup)
        .then(updateProtocolsExposed)
        .then(function () {
          return dup;
        });
    };

    self.deleteProtocol = function (protocol) {
      //note - firebase
      return self.firebaseProtocols.$remove(protocol)
        .then(updateProtocolsExposed);
    };

    self.saveProtocol = function (protocol) {
      //note - firebase
      return self.firebaseProtocols.$save(protocol).
        then(updateProtocolsExposed);
    };

    self.clearProtocol = function (protocol) {
      return _.assign(protocol, Omniprotocol.utils.getScaffoldProtocol());
    };

    self.convertToAutoprotocol = Autoprotocol.fromAbstraction;

    // watchers //

    simpleLogin.watch(function (user) {
      if (!!user) {
        //note - firebase
        self.firebaseProtocolSync = new FBProfile(user.uid, 'omniprotocols');
        self.firebaseProtocols    = self.firebaseProtocolSync.$asArray();
        updateProtocolsExposed();
      }
    });

    // helpers //

    function updateProtocolsExposed () {
      return $q.when(self.protocols = setProtocolList(self.firebaseProtocols));
    }

    function setProtocolList (protocols) {
      self.protocols.length = 0;
      _.forEach(protocols, function (protocol) {
        self.protocols.push(protocol);
      });
      return self.protocols;
    }

    return self;

  });
