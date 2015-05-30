'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.RunHelper
 * @description
 * # RunHelper
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('RunHelper', function ($q, Authentication, Run, ProtocolHelper, simpleLogin, FBProfile, Omniprotocol, UUIDGen, Platform, Database) {

    var self = this;

    self.runs       = [];
    self.currentRun = {};

    self.assignCurrentRun = function (inputRun) {
      _.assign(self.currentRun, Omniprotocol.utils.getScaffoldRun(), inputRun);
      ProtocolHelper.assignCurrentProtocol(self.currentRun.protocol);
      return self.currentRun;
    };

    self.verifyRun = function (protocol, transcripticProject) {
      var run = createNewRunObject(protocol);

      if (_.isEmpty(run.autoprotocol)) {
        return $q.reject(null);
      }
      
      return Run.verify({
        title    : 'Verification of ' + protocol.metadata.name + ' - ' + Date.now(),
        protocol : run.autoprotocol
      }).$promise
    };

    self.createRun = function (protocol, transcripticProject, testMode) {
      var run = createNewRunObject(protocol);

      if (_.isEmpty(run.autoprotocol)) {
        return $q.reject(null);
      }

      return Run.submit({project: transcripticProject}, {
        title    : 'Run of ' + protocol.metadata.name,
        protocol : run.autoprotocol,
        test_mode: !!testMode
      }).$promise.then(function (submissionResult) {
          console.log(submissionResult);

          _.assign(run, {
            transcripticProjectId: transcripticProject,
            transcripticRunId    : submissionResult.id,
            transcripticRunInfo  : _.cloneDeep(submissionResult)
          });

          //note - firebase
          return self.firebaseRuns.$add(run)
            .then(updateRunsExposed)
            .then(_.partial($q.when, submissionResult));

        }, function (submissionFailure) {
          console.warn('run failure', submissionFailure);
          return $q.reject(submissionFailure);
        });
    };

    self.updateRunInfo = function (runObj) {
      var runId       = _.result(runObj, 'transcripticRunId'),
          projectId   = _.result(runObj, 'transcripticProjectId'),
          runData     = _.result(runObj, 'data'),
          runInfo     = _.result(runObj, 'transcripticRunInfo'),
          runStatus   = _.result(runInfo, 'status', ''),
          runCompleted = (runStatus == 'complete');

      console.log(_.isUndefined(runInfo), _.isEmpty(runData), !runCompleted,  runId, projectId, runData, runObj);

      if ( (_.isUndefined(runInfo) || _.isEmpty(runData) || !runCompleted) && (runId && projectId)) {
        var requestPayload = {project: projectId, run: runId};
        console.log('getting info');
        return Run.view(requestPayload)
          .$promise
          .then(function updateRunInfoSuccess (runInfo) {
            return _.assign(runObj, {
              transcripticRunInfo: runInfo
            });
          })
          .then(self.saveRun)
          .then(function () {
            var runInfo     = _.result(runObj, 'transcripticRunInfo'),
                runStatus   = _.result(runInfo, 'status', ''),
                runCompleted = (runStatus == 'complete');

            //todo - refine mechanics of this - need to handle incomplete protocols
            if (!runCompleted) {
              return $q.when(runObj);
            }

            return Run.data(requestPayload)
              .$promise
              .then(function (runData) {
                return _.assign(runObj, {
                  data: runData
                });
              })
              .then(self.saveRun);
          });
      } else {
        if (!runId || !projectId) {
          console.warn('run information for transcriptic is missing...')
        }
        return $q.when(runObj);
      }
    };

    self.saveRun = function (runObj) {
      if (!hasNecessaryMetadataToSave(runObj)) {
        assignNecessaryMetadataToRun(runObj);
      }

      //hack for firebase
      //todo - verify this is working
      var firebaseRecord = self.firebaseRuns.$getRecord(runObj.$id);
      if (runObj.$id && firebaseRecord) {
        //console.log(firebaseRecord);
        _.assign(firebaseRecord, runObj);
        return self.firebaseRuns.$save(firebaseRecord)
          .then(updateRunsExposed);
      } else {
        //fixme - this often gets called unnecessarily
        return self.firebaseRuns.$add(runObj).
          then(function (ref) {
            var firebaseProto = self.firebaseRuns.$getRecord(ref.key());
            //console.log(ref.key(), firebaseProto);
            !_.isEmpty(firebaseProto) && self.assignCurrentRun(firebaseProto);
          })
          .then(updateRunsExposed);
      }
    };

    // watchers //

    simpleLogin.watch(function (user) {
      if (!!user) {
        //note - firebase
        self.firebaseRunSync = new FBProfile(user.uid, 'runs');
        self.firebaseRuns    = self.firebaseRunSync.$asArray();


        /*
        self.firebaseRuns.$loaded()
          .then(updateRunsExposed)
          .then(function () {
            _.forEach(self.firebaseRuns, function (run) {

              if (!Platform.isCompliantId(run.metadata.id)) {
                run.metadata.oldId = run.metadata.id;
                run.metadata.id = UUIDGen();
                self.firebaseRuns.$save(run);
              }


              //todo - update protocol ids? shouldn't be necessary

            });
          });
        */

        Platform.authenticate('maxwell@autodesk.com')
          .then(self.firebaseRuns.$loaded)
          .then(function () {
            //use only if uploading to DB
            return $q.all(_.map(self.firebaseRuns, function (protocol) {
              var pruned = Database.removeExtraneousFields(protocol);
              return Platform.saveProject(pruned);
            }));
          })
          .then(Platform.get_all_project_ids)
          .then(function (rpc) {
            console.log(rpc);
            return $q.all(_.map(rpc.result, Platform.getProject));
          })
          .then(function (projects) {
            return _.map(projects, Database.removeExtraneousFields);
          })
          .then(updateRunsExposed)
          .then(console.log.bind(console));
      }
    });

    // helpers //

    function createNewRunObject (protocol) {
      var run = _.assign(Omniprotocol.utils.getScaffoldRun(), {
        protocol    : _.cloneDeep(protocol),
        autoprotocol: ProtocolHelper.convertToAutoprotocol(protocol)
      });

      //assign metadata
      _.assign(run.metadata, generateNewRunMetadata(protocol), run.metadata);

      return run;
    }

    //todo - handle tags
    //note - does not handle protocol, need to attach that separately (not in metadata)
    function generateNewRunMetadata (protocol) {
      return {
        id      : UUIDGen(),
        name    : 'Run of ' + _.result(protocol, 'metadata.name', 'CX1 Protocol'),
        date    : (new Date()).toString(),
        type    : 'run',
        author  : {
          name: Authentication.getUsername(),
          id  : Authentication.getUserId()
        },
        protocol: {
          id    : _.result(protocol, 'metadata.id', null),
          name  : _.result(protocol, 'metadata.name', null),
          author: _.result(protocol, 'metadata.author', null)
        }
      }
    }

    function assignNecessaryMetadataToRun (runObj) {
      return _.assign(runObj.metadata, generateNewRunMetadata(runObj.protocol), runObj.metadata);
    }

    function hasNecessaryMetadataToSave (runObj) {
      return _.every(['id', 'name', 'type', 'author', 'protocol'], function (field) {
        return !_.isUndefined(_.result(runObj.metadata, field));
      });
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
