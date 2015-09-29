'use strict';

/**
 * @ngdoc function
 * @name wetLabAccelerator.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('ProtocolCtrl', function ($scope, $http, Run, simpleLogin, FBProfile) {

    var self = this;

    /*
    // local protocols

    self.localProtocols = ['aaron-growth', 'growth-curve-generic', 'pcr-example', 'many-steps'];

    self.retrieveLocal = function (protocol) {
      self.selectedProtocol = protocol;
      $http.get('demo_protocols/' + protocol + '.json').success(function(data) {
        //self.exampleProtocol = new ProtocolFactory(data);
        self.protocolMeta = {
          name : protocol
        };
        self.protocolSelected = data;
      });
    };

    self.retrieveLocal(self.localProtocols[0]);
    */

    var protocolScaffold = function () {
      return {
        meta    : {
          name: "myProtocol"
        },
        protocol: {
          refs        : {},
          instructions: []
        }
      };
    };

    self.newProtocol = function () {
      if ( self.firebaseProtocols ) {
        self.firebaseProtocols.$add(protocolScaffold()).then(function (ref) {
          self.protocol = self.firebaseProtocols.$getRecord(ref.key());
        });
      } else {
        self.protocol = protocolScaffold();
      }
    };

    self.canSubmitRun = function () {
      return !_.isEmpty(self.project) && !_.isEmpty(self.protocol) && !!self.runTitle;
    };

    //firebase protocols

    simpleLogin.watch(function(user) {
      if (!!user) {
        self.firebaseProtocolSync = new FBProfile(user.uid, 'protocols');
        self.firebaseProtocols = self.firebaseProtocolSync.$asArray();
      }
    });

    self.retrieveFirebase = function (p) {
      self.protocol = self.firebaseProtocols.$getRecord(p.$id);
    };

    self.saveProtocolToFirebase = function () {
      //todo - clean up
      self.firebaseProtocols.$save(self.protocol);
    };

    self.deleteFirebaseProtocol = function (protocol) {
      if (protocol) {
        self.firebaseProtocols.$remove(protocol);
        delete self.protocol;
      }
    };

    // SUBMIT / ANALYZE RUNS

    function constructRunPayload () {
      return {
        title: self.runTitle,
        protocol: self.protocol.protocol
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
  });
