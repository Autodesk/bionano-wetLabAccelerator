'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txRequestresponse
 * @description
 * #
 *
 * @param response {Object} Polymorphic - acutal response provided from transcriptic, with fields
 *    on error, whole response will be shown (so pass what should be shown)
 *    on success, expects the following fields:
 *        project (object minimally with key 'id')
 *        total_cost
 *        id (run ID)
 *
 * @param config {Object} Pass in a config with set of string to display for following situations:
 * type {String} text displayed in the corner
 * initiated {Boolean} to show the div once started
 * processing {Boolean} when waiting for repsonse
 * error {Boolean} Response has errored
 * textProcessing {String} text displayed when processing == true
 * textSuccess {String} text displayed when error == true
 * textError {String} text displayed when error != true
 */
angular.module('transcripticApp')
  .directive('txRequestresponse', function (Auth, Communication) {
    return {
      templateUrl: 'views/tx-requestresponse.html',
      restrict: 'E',
      scope: {
        config: '=',
        response: '='
      },
      link: function (scope, element, attrs) {
        scope.transcripticLink = function () {
          if (_.isEmpty(scope.response) || !scope.response.id) { return null; }

          return Communication.transcripticRoot +
            Auth.organization() +
            '/' + scope.response.project.url +
            '/runs/' + scope.response.id;
        }
      }
    };
  });
