'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('DashboardCtrl', function ($scope, simpleLogin, FBProfile) {

    var self = this;

    var protocolScaffold = function () {
      return {
        meta    : {
          name: "myProtocol"
        },
        protocol: {
          refs        : {},
          instructions: []
        }
      };
    };

    self.newProtocol = function () {
      if ( self.firebaseProtocols ) {
        self.firebaseProtocols.$add(protocolScaffold()).then(function (ref) {
          self.protocol = self.firebaseProtocols.$getRecord(ref.key());
        });
      } else {
        self.protocol = protocolScaffold();
      }
      console.log(self);
    };

    //firebase protocols

    simpleLogin.watch(function(user) {

      if (!!user) {
        self.firebaseProtocolSync = new FBProfile(user.uid, 'protocols');
        self.firebaseProtocols = self.firebaseProtocolSync.$asArray();
      }

    });

    self.retrieveFirebase = function (p) {
      self.protocol = self.firebaseProtocols.$getRecord(p.$id);
      console.log(p);
    };

    console.log(self,$scope);

  });
