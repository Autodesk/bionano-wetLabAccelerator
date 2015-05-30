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
        },
        watchers = [];

    self.authenticate = function (userstring) {
      //todo
      return Platform.authenticate(userstring).
        then(Platform.getUserInfo).
        then(function (userInfo) {
          userInfo.id = userInfo.uid;
          //todo - handle tx credentials?
        });
    };

    function triggerWatcher (fn) {
      fn(userInfo);
    }


    function triggerWatchers () {
      angular.forEach(watchers, triggerWatcher);
    }

    self.watch = function (cb, $scope) {
      triggerWatcher(cb);
      watchers.push(cb);
      var unbind = function () {
        var i = watchers.indexOf(cb);
        if (i > -1) {
          watchers.splice(i, 1);
        }
      };
      if ($scope) {
        $scope.$on('$destroy', unbind);
      }
      return unbind;
    };

    //todo - shouldn't use simpleLogin anymore
    //todo - set up a local watch
    //todo - set up a login function (which for now just takes userstring) -> Platform.authenticate

    /*
    //testing
    Platform.authenticate('maxwell@autodesk.com').
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
      */

    //todo - update these from Platform
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
  })
;
