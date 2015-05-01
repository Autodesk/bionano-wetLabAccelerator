'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txRun
 * @description
 * # txRun
 */
angular.module('transcripticApp')
  .directive('txRun', function ($q, Auth, Autoprotocol, Omniprotocol, Run, Project, RunHelper) {
    return {
      templateUrl     : 'views/tx-run.html',
      restrict        : 'E',
      scope           : {
        protocol    : '=',
        protocolForm: '='
      },
      bindToController: true,
      controllerAs    : 'runCtrl',
      controller      : function ($scope, $element, $attrs) {

        var self               = this,
            firstProjIdPromise = $q.when();

        Auth.watch(function () {
          firstProjIdPromise = Project.list().$promise.then(function (projects) {
            return $q.when(projects[0].id);
          });
        });

        // SUBMIT / ANALYZE RUNS

        //todo - pending GH#175 - redesign of run dialog
        //todo - this should be passed in from the list...
        //todo - alternatively, we can just create a project behind the scenes and automatically name

        function resourceWrap (funcToRun, toModify) {
          angular.extend(toModify.config, {
            initiated : true,
            processing: true
          });

          firstProjIdPromise.then(function (firstProjId) {
            funcToRun(self.protocol, firstProjId).
              then(function runSuccess (d) {
                console.log(d);
                angular.extend(toModify.config, {
                  processing: false,
                  error     : false
                });
                angular.extend(toModify.response, d);
              }, function runFailure (e) {
                console.log(e);
                angular.extend(toModify.config, {
                  processing: false,
                  error     : true
                });
                //use as simple check for something like a 404 error - i.e. not protocol error but $http error
                if (angular.isUndefined(e.data.protocol)) {
                  angular.extend(toModify.response, {"error": "Request did not go through... check the console"})
                } else {
                  angular.extend(toModify.response, e.data.protocol);
                }
              });
          });
        }

        self.analysisResponse = {
          config  : {
            type          : "Verification",
            textProcessing: "Processing Verification...",
            textSuccess   : "Protocol valid",
            textError     : "Problems with Protocol listed below"
          },
          response: {}
        };
        self.runResponse      = {
          config  : {
            type          : "Run",
            textProcessing: "Processing Run...",
            textSuccess   : "Protocol initiated",
            textError     : "There was an error running your protocol"
          },
          response: {}
        };

        self.analyze = angular.bind(self, resourceWrap, RunHelper.verifyRun, self.analysisResponse);
        self.submit  = angular.bind(self, resourceWrap, RunHelper.createRun, self.runResponse);


      },
      link            : function (scope, element, attrs) {


      }
    };

  });
