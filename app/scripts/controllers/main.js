'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('MainCtrl', function ($scope, $http, Run, simpleLogin, FBProfile) {

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

    self.newProtocol = function () {
      self.firebaseProtocols.$add({
        meta: {
          name : "myProtocol"
        },
        protocol: {
          refs: {},
          instructions: []
        }
      }).then(function (ref) {
        self.protocol = self.firebaseProtocolSync.$getRecord(ref.key());
      });
    };

    self.canSubmitRun = function () {
      return !_.isEmpty(self.project) && !_.isEmpty(self.protocol) && !!self.runTitle;
    };

    //firebase protocols

    var userid;

    simpleLogin.watch(function(user) {
      if (!!user) {
        userid = user.uid;
        self.firebaseProtocolSync = new FBProfile(userid, 'protocols');
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

    self.deleteFirebaseProtocol = function (id) {
      if (id) {
        self.firebaseProtocols.$remove(id);
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
