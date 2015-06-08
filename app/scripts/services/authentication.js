'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Authentication
 * @description
 * # Authentication
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('Authentication', function ($q, $cookies, Platform) {
    var self = this;

    var userInfo = {},
        watchers = [];

    self.localAuthenticate = function (token) {
      Platform.getUserInfo(token).
        then(function (retrieved) {
          _.assign(userInfo, retrieved, {
            token: token,
            email: retrieved.email,
            name : retrieved.name
          });

          triggerWatchers();
        }).
        catch(function (err) {
          //todo - handle error
          console.log(err);
        });
    };

    self.isAuthenticated = Platform.isAuthenticated;

    //returns promise, resolving to whether successful or not
    self.unauthenticate = function () {
      return Platform.unauthenticate()
        .then(function () {
          userInfo = {};
          triggerWatchers();
          return true;
        })
        .catch(_.constant(false));
    };

    //debugging only. Should check for cookie and use self.localAuthenticate
    self.authenticate = function (userstring) {
      return Platform.authenticate(userstring)
        .then(self.localAuthenticate);
    };

    //debugging only.
    self.isAuthenticatedLocal = function () {
      return $q.when(angular.isDefined($cookies['bionano-platform-token']));
    };

    function triggerWatcher (fn) {
      var toPass = _.isEmpty(userInfo) ? null : _.cloneDeep(userInfo);
      fn(toPass);
    }

    function triggerWatchers () {
      _.forEach(watchers, triggerWatcher);
    }

    self.watch = function (cb, $scope) {
      triggerWatcher(cb);
      watchers.push(cb);
      var unbind = function () {
        _.remove(watchers, cb);
      };
      if ($scope) {
        $scope.$on('$destroy', unbind);
      }
      return unbind;
    };

    self.getUsername = function () {
      return userInfo.name;
    };

    //todo - not working
    self.getUserId = function () {
      return userInfo.token;
    };


    //init - check for cookie, authenticate if present

    var initialAuthToken = $cookies['bionano-platform-token'];
    if (!!initialAuthToken) {
      console.warn('found user info', initialAuthToken);
      self.localAuthenticate(initialAuthToken);
    } else {
      console.warn('no user info found');
    }

  })
/**
 * A directive that shows elements only when user is logged in to the platform
 */
  .directive('ngShowAuth', function (Authentication, $timeout) {
    var isLoggedIn;
    Authentication.watch(function (user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link    : function (scope, el) {
        el.addClass('ng-cloak'); // hide until we process it

        function update () {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !isLoggedIn);
          }, 0);
        }

        update();
        Authentication.watch(update, scope);
      }
    };
  })

/**
 * A directive that shows elements only when user is logged out of the platform
 */
  .directive('ngHideAuth', function (Authentication, $timeout) {
    var isLoggedIn;
    Authentication.watch(function (user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link    : function (scope, el) {
        function update () {
          el.addClass('ng-cloak'); // hide until we process it

          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', isLoggedIn !== false);
          }, 0);
        }

        update();
        Authentication.watch(update, scope);
      }
    };
  });
