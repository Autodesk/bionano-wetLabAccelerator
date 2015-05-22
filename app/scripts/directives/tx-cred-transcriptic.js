'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txCredTranscriptic
 * @description
 * # txCredTranscriptic
 *
 * usage: <tx-cred-transcriptic cred-valid="ctrl.model" ng-form="transcripticCred"></tx-cred-transcriptic>
 * !!! do not use 'form' instead of 'ng-form'
 *
 * and will expose to formController
 */
angular.module('transcripticApp')
  .directive('txCredTranscriptic', function (simpleLogin, FBProfile) {
    return {
      templateUrl: 'views/tx-cred-transcriptic.html',
      restrict: 'E',
      require: 'form',
      bindToController: true,
      controllerAs: 'authCtrl',
      scope: {
        credValid: '='
      },
      controller: function ($scope, $element, $attrs) {

        var self = this,
            authIsValid = false;

        $scope.$watch('auth', checkAuthIsValid);

        //don't actually bind to Auth here, Auth listens to 'txAuth' from firebase directly
        //will need to refactor to pull via REST or something, and shuold update DB automatically
        var bindtoWatcher = angular.noop;
        simpleLogin.watch(function(user) {
          self.loggedIn = !!user;
          if (!!user) {
            bindtoWatcher();
            new FBProfile(user.uid, 'txAuth')
              .$asObject()
              .$bindTo($scope, 'auth')
              .then(function (unbind) {
                bindtoWatcher = unbind;
              });
          }
        });

        function checkAuthIsValid (creds) {
          //todo - ping transcriptic?
          authIsValid = true;
        }

        self.forgetCreds = function () {
          //todo
        };

        self.authValid = function () {
          return authIsValid;
        };

        self.verifyCreds = checkAuthIsValid;

        //note that temporarily we will get errors in the console for invalid credentials (and you have to be signed into firebase), but once move DB that will go away.
      },
      link: function (scope, element, attrs, formCtrl) {
        scope.$watch(_.result(formCtrl, '$valid', false), function (isValid) {
          scope.credValid = isValid;
        });
      }
    };
  });
