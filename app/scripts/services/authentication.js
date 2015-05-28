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
      then(Platform.get_all_project_ids).
      then(function (rpc) {
        console.log(rpc);
        return $q.all(_.map(rpc.result, Platform.getProjectMetadata));
      }).
      then(console.log.bind(console));

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
