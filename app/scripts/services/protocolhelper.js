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
  .service('ProtocolHelper', function ($q, UUIDGen, simpleLogin, FBProfile, Omniprotocol, Autoprotocol, Authentication) {

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

      _.assign(dup.metadata, generateNewProtocolMetadata());

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
      //console.log('saving', protocol, protocol.$id, protocol === self.currentProtocol, self.firebaseProtocols);

      if (!hasNecessaryMetadataToSave(protocol)) {
        assignNecessaryMetadataToProtocol(protocol);
      }

      //hack for firebase
      var firebaseRecord = self.firebaseProtocols.$getRecord(protocol.$id);
      if (protocol.$id && firebaseRecord) {
        //console.log(firebaseRecord);
        _.assign(firebaseRecord, protocol);
        return self.firebaseProtocols.$save(firebaseRecord)
          .then(updateProtocolsExposed);
      } else {
        return self.firebaseProtocols.$add(protocol).
          then(function (ref) {
            var firebaseProto = self.firebaseProtocols.$getRecord(ref.key());
            //console.log(ref.key(), firebaseProto);
            !_.isEmpty(firebaseProto) && self.assignCurrentProtocol(firebaseProto);
          })
          .then(updateProtocolsExposed);
      }

    };

    self.clearProtocol = function (protocol) {
      return $q.when(_.assign(protocol, Omniprotocol.utils.getScaffoldProtocol()));
    };

    self.convertToAutoprotocol = Autoprotocol.fromAbstraction;

    // watchers //

    simpleLogin.watch(function (user) {
      if (!!user) {
        //note - firebase
        self.firebaseProtocolSync = new FBProfile(user.uid, 'omniprotocols');
        self.firebaseProtocols    = self.firebaseProtocolSync.$asArray();

        self.firebaseProtocols.$loaded()
          .then(updateProtocolsExposed);
      }
    });

    // helpers //

    //todo - handle tags (substitute for parent child relationships)
    function generateNewProtocolMetadata () {
      return {
        id    : UUIDGen(),
        date  : '' + (new Date()).valueOf(),
        type  : 'protocol',
        author: {
          name: Authentication.getUsername(),
          id  : Authentication.getUserId()
        }
      }
    }

    function assignNecessaryMetadataToProtocol (protocol) {
      return _.assign(protocol.metadata, generateNewProtocolMetadata(), protocol.metadata);
    }

    function hasNecessaryMetadataToSave (protocol) {
      return _.every(['id', 'name', 'type', 'author'], function (field) {
        return !_.isUndefined(_.result(protocol.metadata, field));
      });
    }

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
