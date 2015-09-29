'use strict';

/**
 * @ngdoc overview
 * @name wetLabAccelerator
 * @description
 * # wetLabAccelerator
 *
 * Main module of the application.
 */
angular
  .module('wetLabAccelerator', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'firebase',
    'angularFileUpload',
    'tx.communication',
    'tx.datavis',
    'tx.protocolEditor'
  ])
  .run(function (simpleLogin, FBProfile, Authentication, $rootScope, $location, $q, Platform, Database) {


    //testing - importing of runs and protocols

    /*
    //todo - be sure to update authentication string here
    simpleLogin.watch(function (user) {
      if (!!user) {

        var txAuthSync = new FBProfile(user.uid, 'txAuth');
        var txAuth = txAuthSync.$asObject();

        Platform.authenticate('maxwell@autodesk.com')
          .then(function () {

            var txAuth = new FBProfile(user.uid, 'txAuth').$asObject();
            txAuth.$watch(function () {
              console.log(txAuth);

              var keymap = {
                'email'       : 'transcripticEmail',
                'key'         : 'transcripticKey',
                'organization': 'transcripticOrg'
              };

              return $q.all(_.map(keymap, function (dbkey, txkey) {
                Platform.userValue(dbkey, txAuth[txkey]);
              }));
            });
          });
      }
    });

    //todo - be sure to update authentication string here
    simpleLogin.watch(function (user) {
      if (!!user) {

        var txAuth = new FBProfile(user.uid, 'txAuth').$asObject();

        var firebaseRunSync = new FBProfile(user.uid, 'runs');
        var firebaseRuns    = firebaseRunSync.$asArray();

        var firebaseProtocolSync = new FBProfile(user.uid, 'omniprotocols');
        var firebaseProtocols    = firebaseProtocolSync.$asArray();

        Platform.authenticate('maxwell@autodesk.com')
          .then(firebaseProtocols.$loaded)
          .then(function () {
            //use only if uploading to DB
            return $q.all(_.map(firebaseProtocols, function (protocol) {
              var pruned = Database.removeExtraneousFields(protocol);
              if (_.has(pruned, 'groups')) {
                return Platform.saveProject(pruned);
              }
            }));
          })
          .then(firebaseRuns.$loaded)
          .then(function () {
            //use only if uploading to DB
            return $q.all(_.map(firebaseRuns, function (protocol) {
              var pruned = Database.removeExtraneousFields(protocol);
              if (_.has(pruned, 'autoprotocol')) {
                return Platform.saveProject(pruned);
              }
            }));
          })
          .then(Platform.get_all_project_ids)
          .then(function (rpc) {
            console.log(rpc);
            return $q.all(_.map(rpc.result, Platform.getProject));
          })
          .then(function (projects) {
            return _.map(projects, Database.removeExtraneousFields);
          })
          .then(console.log.bind(console));
      }
    });
    */

  });
