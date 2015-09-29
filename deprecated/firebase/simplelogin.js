'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.simpleLogin
 * @description
 * # simpleLogin
 * Service in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator')
  .constant('FBURL', 'https://transcriptic.firebaseio.com')
  /**
  * @name firebaseRef
  * @param {String|Array...} path relative path to the root folder in Firebase instance
  * @return a Firebase instance
  */
  .factory('fbref', function ($window, FBURL) {
    function pathRef(args) {
      for (var i = 0; i < args.length; i++) {
        if (angular.isArray(args[i])) {
          args[i] = pathRef(args[i]);
        }
        else if( typeof args[i] !== 'string' ) {
          throw new Error('Argument '+i+' to firebaseRef is not a string: '+args[i]);
        }
      }
      return args.join('/');
    }

    function firebaseRef(path) {
      var ref = new $window.Firebase(FBURL);
      var args = Array.prototype.slice.call(arguments);
      if( args.length ) {
        ref = ref.child(pathRef(args));
      }
      return ref;
    }

    return firebaseRef;
  })
  /*
  Factory for profile, can pass in UID and child paths
   */
  .factory('FBProfile', function ($firebase, fbref) {
    return function (uid) {
      if (!angular.isString(uid)) { throw new Error('uid required for FBProfile'); }
      return $firebase(fbref.apply(null, ['users'].concat(Array.prototype.slice.call(arguments))));
    }
  })
  /*
  Simple login helper
   */
  .factory('simpleLogin', function($firebaseAuth, fbref, createProfile, changeEmail) {
    var auth = $firebaseAuth(fbref());
    var listeners = [];

    function statusChange() {
      fns.user = auth.$getAuth();
      angular.forEach(listeners, function(fn) {
        fn(fns.user);
      });
    }

    var fns = {
      user: null,

      getUser: function() {
        return auth.$waitForAuth();
      },

      /**
       * @param {string} email
       * @param {string} pass
       * @returns {*}
       */
      login: function(email, pass) {
        return auth.$authWithPassword({
          email: email,
          password: pass
        }, {rememberMe: true});
      },

      logout: function() {
        auth.$unauth();
      },

      createAccount: function(email, pass, name) {
        return auth.$createUser({email: email, password: pass})
          .then(function() {
            // authenticate so we have permission to write to Firebase
            return fns.login(email, pass);
          })
          .then(function(user) {
            // store user data in Firebase after creating account
            return createProfile(user.uid, email, name).then(function () {
              return user;
            });
          });
      },

      changePassword: function(email, oldpass, newpass) {
        return auth.$changePassword({email: email, oldPassword: oldpass, newPassword: newpass});
      },

      changeEmail: function(password, oldEmail, newEmail) {
        return changeEmail(password, oldEmail, newEmail, this);
      },

      removeUser: function(email, pass) {
        return auth.$removeUser({email: email, password: pass});
      },

      watch: function(cb, $scope) {
        fns.getUser().then(function(user) {
          cb(user);
        });
        listeners.push(cb);
        var unbind = function() {
          var i = listeners.indexOf(cb);
          if( i > -1 ) { listeners.splice(i, 1); }
        };
        if( $scope ) {
          $scope.$on('$destroy', unbind);
        }
        return unbind;
      }
    };

    auth.$onAuth(statusChange);
    statusChange();

    return fns;
  })
  /*
  Factory to create new profile
   */
  .factory('createProfile',  function(fbref, $q, $timeout) {
    return function (id, email, name) {
      var ref = fbref('users', id),
          def = $q.defer();
      ref.set({email: email, name: name || firstPartOfEmail(email)}, function (err) {
        $timeout(function () {
          if (err) {
            def.reject(err);
          }
          else {
            def.resolve(ref);
          }
        })
      });

      function firstPartOfEmail(email) {
        return ucfirst(email.substr(0, email.indexOf('@')) || '');
      }

      function ucfirst(str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
      }

      return def.promise;
    }
  })
  .factory('changeEmail', function(fbref, $q, $rootScope) {
    return function(password, oldEmail, newEmail, simpleLogin) {
      var ctx = { old: { email: oldEmail }, curr: { email: newEmail } };

      // this prevents the routes.js logic from redirecting to the login page
      // while we log out of the old account and into the new one, see routes.js
      $rootScope.authChangeInProgress = true;

      // execute activities in order; first we authenticate the user
      return authOldAccount()
        // then we fetch old account details
        .then( loadOldProfile )
        // then we create a new account
        .then( createNewAccount )
        // then we copy old account info
        .then( copyProfile )
        // and once they safely exist, then we can delete the old ones
        // we have to authenticate as the old user again
        .then( authOldAccount )
        .then( removeOldProfile )
        .then( removeOldLogin )
        // and now authenticate as the new user
        .then( authNewAccount )
        .catch(function(err) { console.error(err); return $q.reject(err); })
        .finally(function() {
          $rootScope.authChangeInProgress = false;
        });

      function authOldAccount() {
        return simpleLogin.login(ctx.old.email, password).then(function(user) {
          ctx.old.uid = user.uid;
        });
      }

      function loadOldProfile() {
        var def = $q.defer();
        ctx.old.ref = fbref('users', ctx.old.uid);
        ctx.old.ref.once('value',
          function(snap){
            var dat = snap.val();
            if( dat === null ) {
              def.reject(oldEmail + ' not found');
            }
            else {
              ctx.old.name = dat.name;
              def.resolve();
            }
          },
          function(err){
            def.reject(err);
          });
        return def.promise;
      }

      function createNewAccount() {
        return simpleLogin.createAccount(ctx.curr.email, password, ctx.old.name).then(function(user) {
          ctx.curr.uid = user.uid;
        });
      }

      function copyProfile() {
        var d = $q.defer();
        ctx.curr.ref = fbref('users', ctx.curr.uid);
        var profile = {email: ctx.curr.email, name: ctx.old.name||''};
        ctx.curr.ref.set(profile, function(err) {
          if (err) {
            d.reject(err);
          } else {
            d.resolve();
          }
        });
        return d.promise;
      }

      function removeOldProfile() {
        var d = $q.defer();
        ctx.old.ref.remove(function(err) {
          if (err) {
            d.reject(err);
          } else {
            d.resolve();
          }
        });
        return d.promise;
      }

      function removeOldLogin() {
        var def = $q.defer();
        simpleLogin.removeUser(ctx.old.email, password).then(function() {
          def.resolve();
        }, function(err) {
          def.reject(err);
        });
        return def.promise;
      }

      function authNewAccount() {
        return simpleLogin.login(ctx.curr.email, password);
      }
    };
  })
/**
 * Wraps ng-cloak so that, instead of simply waiting for Angular to compile, it waits until
 * simpleLogin resolves with the remote Firebase services.
 *
 * <code>
 *    <div ng-cloak>Authentication has resolved.</div>
 * </code>
 */
  .config(function($provide) {
    // adapt ng-cloak to wait for auth before it does its magic
    $provide.decorator('ngCloakDirective', function($delegate, simpleLogin) {
      var directive = $delegate[0];
      // make a copy of the old directive
      var _compile = directive.compile;
      directive.compile = function(element, attr) {
        simpleLogin.getUser().then(function() {
          // after auth, run the original ng-cloak directive
          _compile.call(directive, element, attr);
        });
      };
      // return the modified directive
      return $delegate;
    });
  })
/**
 * A directive that shows elements only when user is logged in.
 */
  .directive('ngShowAuth', function (simpleLogin, $timeout) {
    var isLoggedIn;
    simpleLogin.watch(function(user) {
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
        simpleLogin.watch(update, scope);
      }
    };
  })

/**
 * A directive that shows elements only when user is logged out.
 */
  .directive('ngHideAuth', function (simpleLogin, $timeout) {
    var isLoggedIn;
    simpleLogin.watch(function(user) {
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
        simpleLogin.watch(update, scope);
      }
    };
  });
