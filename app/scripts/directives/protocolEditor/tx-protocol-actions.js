'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolActions
 * @description
 * # txProtocolActions
 */
angular.module('tx.protocolEditor')
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
            return $q.when(projects[0].id);
          });
        });

        self.logAutoprotocol = function () {
          console.log(angular.toJson(Autoprotocol.fromAbstraction(self.protocol), true));
        };

        self.toggleMetadataVisible = function (event, forceState) {
          event.preventDefault();
          event.stopPropagation();
          $scope.protocolMetadataVisible = _.isUndefined(forceState) ? !$scope.protocolMetadataVisible : forceState;
        };

        self.autoprotocolConvertFunction = Autoprotocol.fromAbstraction;

        // SUBMIT / ANALYZE RUNS

        function constructRunPayload () {
          return {
            title: "My Submission", // todo - make editable
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

        self.verifyProtocol = angular.bind(self, resourceWrap, Run.analyze, self.analysisResponse);
        self.executeProtocol = angular.bind(self, resourceWrap, Run.submit, self.runResponse);
      },
      link: function postLink(scope, element, attrs) {

      }
    };
  });
