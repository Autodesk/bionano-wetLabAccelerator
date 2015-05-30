'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.protocolHelperNew
 * @description
 * # protocolHelperNew
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ProtocolHelperNew', function ($q, $rootScope, $timeout, UUIDGen, Omniprotocol, Autoprotocol, Authentication, Notify, Database) {
    var self = this;

    //make sure reference is preserved
    //is updated from firebase currently
    self.protocols = [];

    self.currentProtocol = {};

    //todo - init -> get all protocols

    self.assignCurrentProtocol = function (newProtocol) {
      _.assign(self.currentProtocol,
        Omniprotocol.utils.getScaffoldProtocol(),
        newProtocol);

      $timeout(function () {
        $rootScope.$broadcast('editor:newprotocol');
      })
    };

    self.addProtocol = function (inputProtocol) {
      var protocol = _.assign(Omniprotocol.utils.getScaffoldProtocol(), inputProtocol);

      return Database.saveProject(protocol)
        .then(updateProtocolsExposed)
        .then(function () {
          return protocol;
        });
    };

    self.deleteProtocol = function (protocol) {
      return Database.removeProject(protocol)
        .then(updateProtocolsExposed);
    };

    self.saveProtocol = function (protocol) {
      //note - firebase
      //console.log('saving', protocol, protocol.$id, protocol === self.currentProtocol, self.firebaseProtocols);

      if (!hasNecessaryMetadataToSave(protocol)) {
        assignNecessaryMetadataToProtocol(protocol);
      }

      return Database.saveProject(protocol).
        then(self.assignCurrentProtocol).
        then(updateProtocolsExposed);
    };

    self.duplicateProtocol = function (protocol) {
      var dup = _.cloneDeep(protocol);

      self.clearIdentifyingInfo(dup);

      return self.saveProtocol(dup)
        .then(updateProtocolsExposed)
        .then(function () {
          return dup;
        });
    };

    self.clearIdentifyingInfo = function (protocol) {
      return _.assign(protocol.metadata, generateNewProtocolMetadata());
    };

    self.clearProtocol = function (protocol) {
      return $q.when(_.assign(protocol, Omniprotocol.utils.getScaffoldProtocol()));
    };

    self.convertToAutoprotocol = function (protocol) {
      try {
        return Autoprotocol.fromAbstraction(protocol);
      } catch (e) {
        if (e instanceof ConversionError) {
          $rootScope.$broadcast('editor:verificationFailureLocal', [{
            $index   : e.$index,
            message  : e.message,
            field    : e.field,
            fieldName: e.fieldName
          }]);
        } else {
          //how to handle?
          console.error(e);
          Notify({
            message: 'Unknown error converting protocol to Autoprotocol. Check browser console.',
            error  : true
          });
        }
      }
    };


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
        return !_.isEmpty(_.result(protocol.metadata, field));
      });
    }

    function updateProtocolsExposed () {
      return $q.when(self.protocols = setProtocolList(Database.getAllProjectMetadataOfType('project')));
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
