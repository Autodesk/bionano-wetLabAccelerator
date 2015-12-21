/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.Authentication
 * @description
 * # Authentication
 * Service in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator')
  .service('Authentication', function ($q, Database) {
    var self = this;

    var userInfo = {},
        watchers = [];

    Database.dummyAccount(function (creds) {
      _.assign(userInfo, creds);
      self.isAuthenticated = true;
      triggerWatchers();
    });

    //returns promise, resolving to whether successful or not
    self.unauthenticate = function () {
      //you can't do that in this version
      return $q.when();
    };

    self.authenticate = function (userstring) {
      //you can't do that in this version
      return $q.when();
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

    self.getUserId = function () {
      return userInfo.uid;
    };
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
