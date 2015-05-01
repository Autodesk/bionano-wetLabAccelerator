'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Authentication
 * @description
 * # Authentication
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('Authentication', function (simpleLogin) {
    var self = this;

    var userInfo = {
      name : '',
      id : ''
    };

    //note - firebase
    simpleLogin.watch(function(user) {
      if (!!user) {
        _.assign(userInfo, {
          id : user.uid,
          name : 'Billy Bob Joe' //todo
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
