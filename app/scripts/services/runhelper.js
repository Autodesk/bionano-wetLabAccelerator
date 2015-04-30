'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.RunHelper
 * @description
 * # RunHelper
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('RunHelper', function ($q, Authentication, Run, ProtocolHelper, simpleLogin, FBProfile, Omniprotocol, UUIDGen) {

    var self = this;

    self.runs = [];
    self.currentRun = {};

    self.createRun = function (protocol, transcripticProject, testMode) {
      var run = _.assign(Omniprotocol.utils.getScaffoldRun(), {
        protocol : _.cloneDeep(protocol),
        autoprotocol : ProtocolHelper.convertToAutoprotocol(protocol)
      });

      //assign metadata
      _.assign(run.metadata, generateNewRunMetadata());

      //todo - verify

      return Run.submit({project: transcripticProject}, {
        title: 'Run of ' + protocol.metadata.name,
        protocol: run.autoprotocol,
        test_mode: !!testMode
      }).$promise.then(function (submissionResult) {
          console.log(submissionResult);

          run.transcripticRunId = submissionResult.id;

          return self.firebaseRuns.$add(run)
            .then(updateRunsExposed);
      }, function (submissionFailure) {
          console.warn('run failure', submissionFailure);
      });
    };

    self.assignCurrentRun = function (inputRun) {
      _.assign(self.currentRun, Omniprotocol.utils.getScaffoldRun(), inputRun);
    };

    // watchers //

    simpleLogin.watch(function (user) {
      if (!!user) {
        //note - firebase
        self.firebaseRunSync = new FBProfile(user.uid, 'runs');
        self.firebaseRuns    = self.firebaseRunSync.$asArray();
      }
    });

    // helpers //

    //todo - handle tags
    //note - does not handle protocol
    function generateNewRunMetadata () {
      return {
        id  : UUIDGen(),
        date: '' + (new Date()).valueOf(),
        type: 'run',
        author : {
          name : Authentication.getUsername(),
          id : Authentication.getUserId()
        },
        protocol: {}
      }
    }

    function setRunList (runs) {
      self.runs.length = 0;
      _.forEach(runs, function (run) {
        self.protocols.push(run);
      });
      return self.runs;
    }

    function updateRunsExposed () {
      return $q.when(self.runs = setRunList(self.firebaseRuns));
    }


    return self;
  });
