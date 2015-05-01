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

    //todo - on data page, when get the run, if not completed, ping transcriptic for data

    self.verifyRun = function (protocol, transcripticProject, testMode) {
      var run = createNewRunObject(protocol);

      return Run.analyze({project: transcripticProject}, {
        title: 'Verification of ' + protocol.metadata.name + ' - ' + Date.now(),
        protocol: run.autoprotocol,
        test_mode: !!testMode
      }).$promise
    };

    self.createRun = function (protocol, transcripticProject, testMode) {
      var run = createNewRunObject(protocol);

      //todo - verify this works - including promises
      return Run.submit({project: transcripticProject}, {
        title: 'Run of ' + protocol.metadata.name,
        protocol: run.autoprotocol,
        test_mode: !!testMode
      }).$promise.then(function (submissionResult) {
          console.log(submissionResult);

          _.assign(run, {
            transcripticRunId : submissionResult.id,
            transcripticRunInfo : _.cloneDeep(submissionResult)
          });

          return self.firebaseRuns.$add(run)
            .then(updateRunsExposed)
            .then(_.partial($q.when, submissionResult));

      }, function (submissionFailure) {
          console.warn('run failure', submissionFailure);
          return $q.reject(submissionFailure);
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

        self.firebaseRuns.$loaded()
          .then(updateRunsExposed);
      }
    });

    // helpers //

    function createNewRunObject (protocol) {
      var run = _.assign(Omniprotocol.utils.getScaffoldRun(), {
        protocol : _.cloneDeep(protocol),
        autoprotocol : ProtocolHelper.convertToAutoprotocol(protocol)
      });

      //assign metadata
      _.assign(run.metadata, generateNewRunMetadata(protocol));

      return run;
    }

    //todo - handle tags
    //note - does not handle protocol
    function generateNewRunMetadata (protocol) {
      return {
        id  : UUIDGen(),
        name: 'Run of ' + _.result(protocol.metadata, 'name', 'CX1 Protocol'),
        date: (new Date()).toString(),
        type: 'run',
        author : {
          name : Authentication.getUsername(),
          id : Authentication.getUserId()
        }
      }
    }

    function setRunList (runs) {
      self.runs.length = 0;
      _.forEach(runs, function (run) {
        self.runs.push(run);
      });
      return self.runs;
    }

    function updateRunsExposed () {
      return $q.when(self.runs = setRunList(self.firebaseRuns));
    }

    return self;
  });
