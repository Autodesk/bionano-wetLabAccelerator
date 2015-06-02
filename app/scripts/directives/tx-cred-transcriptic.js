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
  .directive('txCredTranscriptic', function (TranscripticAuth, Communication, simpleLogin, FBProfile) {
    return {
      templateUrl     : 'views/tx-cred-transcriptic.html',
      restrict        : 'E',
      require         : 'form',
      scope           : {
        credValid: '=?' //outbinding for whether credentials are valid
      },
      bindToController: true,
      controllerAs    : 'authCtrl',
      controller      : function ($scope, $element, $attrs) {

        var self = this;

        self.credentials = {};

        self.validateAuth = function () {
          self.validating = true;
          return Communication.validate()
            .then(function validateSuccess () {
              console.debug('credentials valid');
              self.credValid = true;
            }, function validateFailure () {
              console.debug('credentials invalid');
              self.credValid = false;
            }).
            then(function () {
              self.validating = false;
              return self.credValid;
            });
        };

        TranscripticAuth.watch(function (creds) {
          _.assign(self.credentials, {
            organization: _.result(creds, 'organization'),
            email       : _.result(creds, 'email'),
            key         : _.result(creds, 'key')
          });
          self.validateAuth();
        });

        self.forgetCreds = function () {
          TranscripticAuth.forgetCreds();
        };

      },
      link            : function (scope, element, attrs, formCtrl) {

        scope.$watch('authCtrl.credentials', function (newcreds) {
          TranscripticAuth.batchUpdate(newcreds);

          validateNewCreds()
            .then(function (isValid) {
              !!isValid && TranscripticAuth.persistCreds();
            });
        }, true);

        function validateNewCreds () {
          return scope.authCtrl.validateAuth()
            .then(function (isValid) {
              console.log('validation is ', isValid);
              //todo - not working - maybe need to add a control to the form?
              formCtrl.$setValidity('transcriptic', isValid);
              return isValid;
            });
        }
      }
    };
  });
