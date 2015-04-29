'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txRun
 * @description
 * # txRun
 */
angular.module('transcripticApp')
  .directive('txRun', function ($q, Auth, Autoprotocol, Omniprotocol, Run, Project) {
    return {
      templateUrl: 'views/tx-run.html',
      restrict: 'E',
      scope: {
        protocol: '=',
        protocolForm: '='
      },
      bindToController: true,
      controllerAs: 'runCtrl',
      controller: function ($scope, $element, $attrs) {

        var self = this,
            firstProjIdPromise = $q.when();

        Auth.watch(function () {
          firstProjIdPromise = Project.list().$promise.then(function (projects) {
            return $q.when(projects[0].id);
          });
        });

        // SUBMIT / ANALYZE RUNS

        function constructRunPayload () {
          return {
            title: self.runTitle,
            protocol: Autoprotocol.fromAbstraction(self.protocol)
          };
        }


        function resourceWrap (funcToRun, toModify) {
          angular.extend(toModify.config, {
            initiated: true,
            processing: true
          });

          firstProjIdPromise.then(function (firstProjId) {
            funcToRun({project : firstProjId}, constructRunPayload()).$promise.
              then(function runSuccess (d) {
                console.log(d);
                angular.extend(toModify.config, {
                  processing: false,
                  error: false
                });
                angular.extend(toModify.response, d);
              }, function runFailure (e) {
                console.log(e);
                angular.extend(toModify.config, {
                  processing: false,
                  error: true
                });
                //use as simple check for something like a 404 error - i.e. not protocol error but $http error
                if (angular.isUndefined(e.data.protocol)) {
                  angular.extend(toModify.response, {"error" : "Request did not go through... check the console"})
                } else {
                  angular.extend(toModify.response, e.data.protocol);
                }
              });
          });
        }

        self.analysisResponse = {
          config: {
            type: "Verification",
            textProcessing: "Processing Verification...",
            textSuccess: "Protocol valid",
            textError: "Problems with Protocol listed below"
          },
          response: {}
        };
        self.runResponse = {
          config: {
            type: "Run",
            textProcessing: "Processing Run...",
            textSuccess: "Protocol initiated",
            textError: "There was an error running your protocol"
          },
          response: {}
        };

        self.analyze = angular.bind(self, resourceWrap, Run.analyze, $scope.analysisResponse);
        self.submit = angular.bind(self, resourceWrap, Run.submit, $scope.runResponse);


      },
      link: function(scope, element, attrs) {


      }
    };

  });
