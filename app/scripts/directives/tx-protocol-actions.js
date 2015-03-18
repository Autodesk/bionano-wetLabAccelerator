'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolActions
 * @description
 * # txProtocolActions
 */
angular.module('transcripticApp')
  .directive('txProtocolActions', function ($q, Auth, Autoprotocol, Run, Project) {
    return {
      templateUrl: 'views/tx-protocol-actions.html',
      restrict: 'E',
      scope: {
        protocol: '=',
        protocolForm: '='
      },
      bindToController: true,
      controllerAs: 'actionCtrl',
      controller: function ($scope, $element, $attrs) {
        var self = this,
            firstProjIdPromise = $q.when();

        Auth.watch(function () {
          firstProjIdPromise = Project.list().$promise.then(function (projects) {
            console.log('first proj');
            return $q.when(projects[0].id);
          });
        });

        firstProjIdPromise.then(console.log.bind(console));

        self.logAutoprotocol = function () {
          console.log(angular.toJson(Autoprotocol.fromAbstraction(self.protocol), true));
        };

        self.verifyProtocol = function () {
          var convAuto = Autoprotocol.fromAbstraction(self.protocol);
          console.log(convAuto);

          firstProjIdPromise.then(function (firstProjId) {
            Run.analyze({project: firstProjId}, {title : "Verification", protocol: convAuto}).$promise.then(function (response) {

              self.verifyResponse = response;
              console.log(response);
            });
          });
        };

        self.executeProtocol = function () {
          var convAuto = Autoprotocol.fromAbstraction(self.protocol);
          console.log(convAuto);

          firstProjIdPromise.then(function (firstProjId) {
            Run.submit({project: firstProjId}, {title : "Submission", protocol: convAuto}).$promise.then(function (response) {
              self.runResponse = response;
              console.log(response);
            });
          });
        }
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
