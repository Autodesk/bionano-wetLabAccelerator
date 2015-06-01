'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.protocolHelperNew
 * @description
 * # protocolHelperNew
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ProtocolHelper', function ($q, $rootScope, $timeout, UUIDGen, Omniprotocol, Autoprotocol, Authentication, Notify, Database) {
    var self = this;

    self.currentProtocol = {};

    self.assignCurrentProtocol = function (newProtocol) {
      $timeout(function () {
        $rootScope.$broadcast('editor:newprotocol');
      });

      return _.assign(self.currentProtocol,
        Omniprotocol.utils.getScaffoldProtocol(),
        newProtocol);
    };

    self.getProtocol = function (id) {
      return Database.getProject(id);
    };

    self.createNewProtocol = function (inputProtocol) {
      return _.assign(Omniprotocol.utils.getScaffoldProtocol(), inputProtocol);
    };

    self.addProtocol = function (inputProtocol) {
      var protocol = self.createNewProtocol(inputProtocol);

      return Database.saveProject(protocol)
        .then(function () {
          return protocol;
        });
    };

    self.deleteProtocol = function (protocol) {
      return Database.removeProject(protocol);
    };

    self.saveProtocol = function (protocol) {
      //note - firebase
      //console.log('saving', protocol, protocol.$id, protocol === self.currentProtocol, self.firebaseProtocols);

      if (!protocolHasNecessaryMetadataToSave(protocol)) {
        assignNecessaryMetadataToProtocol(protocol);
      }

      return Database.saveProject(protocol).
        then(self.assignCurrentProtocol);
    };

    self.duplicateProtocol = function (protocol) {
      var dup = _.cloneDeep(protocol);

      self.clearIdentifyingInfo(dup);

      return self.saveProtocol(dup)
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

    //todo - handle tags + versioning
    function generateNewProtocolMetadata () {
      return {
        id    : UUIDGen(),
        date  : '' + (new Date()).valueOf(),
        type  : 'protocol',
        author: {
          name: Authentication.getUsername(),
          id  : Authentication.getUserId()
        },
        "tags": [],
        "db"  : {}
      }
    }

    function assignNecessaryMetadataToProtocol (protocol) {
      return _.assign(protocol.metadata, generateNewProtocolMetadata(), protocol.metadata);
    }

    function protocolHasNecessaryMetadataToSave (protocol) {
      return _.every(['id', 'name', 'type', 'author'], function (field) {
        return !_.isEmpty(_.result(protocol.metadata, field));
      });
    }


    //watch for auth changes
    Authentication.watch(function (creds) {
      self.assignCurrentProtocol({});
    });

  });
