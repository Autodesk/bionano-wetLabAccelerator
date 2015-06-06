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

    self.authenticate = function (userstring) {

      //todo - store userstring / token as a cookie?

      return Platform.authenticate(userstring).
        then(function () {
          return Platform.userValue('userstring', userstring);
        }).
        then(Platform.getUserInfo).
        then(function (retrieved) {
          _.assign(userInfo, retrieved, {
            token : userstring,
            name: retrieved.name
          });

          $cookies['authToken'] = userstring;

          //todo - verify creds are different before triggering
          triggerWatchers();
        }).
        catch(function (err) {
          //todo - handle error
          console.log(err);
        });
    };

    //returns promise, resolving to whether successful or not
    self.unauthenticate = function () {
      return Platform.unauthenticate()
        .then(function () {
          userInfo = {};
          $cookies['authToken'] = '';
          triggerWatchers();
          return true;
        })
        .catch(_.constant(false));
    };

    function triggerWatcher (fn) {
      var toPass = _.isEmpty(userInfo) ? null : _.cloneDeep(userInfo);
      fn(toPass);
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

    self.getUsername = function () {
      return userInfo.name;
    };

    self.getUserId = function () {
      return userInfo.id;
    };


    //init - check for cookie, authenticate if present

    var initialAuthToken = $cookies['authToken'];
    if (!!initialAuthToken) {
      console.warn('found initial auth token', initialAuthToken);
      self.authenticate(initialAuthToken);
    }

  })
/**
 * A directive that shows elements only when user is logged in to the platform
 */
  .directive('ngShowAuth', function (Authentication, $timeout) {
    var isLoggedIn;
    Authentication.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it

        function update() {
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
    Authentication.watch(function(user) {
      isLoggedIn = !!user;
    });

    return {
      restrict: 'A',
      link: function(scope, el) {
        function update() {
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
