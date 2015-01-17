'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('MainCtrl', function ($scope, $http, ProtocolFactory, Run, Project) {

    var self = this;

    // PROTOCOLS

    self.protocols = ['aaron-growth', 'growth-curve-generic', 'pcr-example', 'many-steps'];

    self.retrieve = function (protocol) {
      self.selectedProtocol = protocol;
      $http.get('demo_protocols/' + protocol + '.json').success(function(data) {
        //self.exampleProtocol = new ProtocolFactory(data);
        self.exampleProtocol = data;
      });
    };

    self.retrieve(self.protocols[0]);

    // INSTRUCTIONS



    // SUBMIT / ANALYZE RUNS

    function constructRunPayload () {
      return {
        title: self.runTitle,
        protocol: self.exampleProtocol
      }
    }

    //todo - merge with ordering controller
    function resourceWrap (funcToRun, toModify) {
      angular.extend(toModify.config, {
        initiated: true,
        processing: true
      });

      funcToRun({project : self.project.url}, constructRunPayload()).$promise.
      then(function runSuccess (d) {
        angular.extend(toModify.config, {
          processing: false,
          error: false
        });
        angular.extend(toModify.response, d);
        console.log(d);
      }, function runFailure (e) {
        angular.extend(toModify.config, {
          processing: false,
          error: true
        });
        angular.extend(toModify.response, e.data.protocol);
        console.log(e);
      });
    }

    $scope.analysisResponse = {
      config: {
        type: "Verification",
        textProcessing: "Processing Verification...",
        textSuccess: "Protocol valid",
        textError: "Problems with Protocol listed below"
      },
      response: {}
    };
    $scope.runResponse = {
      config: {
        type: "Run",
        textProcessing: "Processing Run...",
        textSuccess: "Protocol initiated",
        textError: "There was an error running your protocol"
      },
      response: {}
    };

    this.analyze = angular.bind(self, resourceWrap, Run.analyze, $scope.analysisResponse);
    this.submit = angular.bind(self, resourceWrap, Run.submit, $scope.runResponse);

    this.canSubmitRun = function () {
      return !_.isEmpty(this.project) && !_.isEmpty(this.exampleProtocol) && !!this.runTitle;
    };
  });
