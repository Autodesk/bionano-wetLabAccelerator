'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Authentication
 * @description
 * # Authentication
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('Authentication', function ($q, Platform, simpleLogin) {
    var self = this;

    var userInfo = {
      name: '',
      id  : ''
    };

    //testing
    Platform.authenticate('testuser@autodesk.com').
      then(Platform.transcripticCredentials).
      then(console.log.bind(console)).
      then(Platform.get_all_project_ids).
      then(function (rpc) {
        return $q.all(_.map(rpc.result, Platform.getProjectMetadata));
      }).
      then(function (projects) {
        var protocols = _.filter(projects, function (proj) {
          return !!_.result(proj, 'description', false);
        });
        console.log(protocols);
      }).
      catch(function (err) {
        console.log(err);
      });

    //note - firebase
    simpleLogin.watch(function (user) {
      if (!!user) {
        _.assign(userInfo, {
          id  : user.uid,
          name: 'Billy Bob Joe' //todo
        });
      }
    });

    self.getUsername = function () {
      return userInfo.name;
    };

    self.getUserId = function () {
      return userInfo.id;
    };

    return self;
  });
