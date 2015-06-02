'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.runHelperNew
 * @description
 * # runHelperNew
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('RunHelper', function ($q, Authentication, Run, ProtocolHelper, Omniprotocol, UUIDGen, Database) {

    var self = this;

    self.currentRun = {};

    self.assignCurrentRun = function (inputRun) {
      _.assign(self.currentRun, Omniprotocol.utils.getScaffoldRun(), inputRun);
      ProtocolHelper.assignCurrentProtocol(self.currentRun.protocol);
      return self.currentRun;
    };


    // DB interaction

    self.getRun = function (id) {
      return Database.getProject(id);
    };

    self.saveRun = function saveRun (run) {

      if (!runHasNecessaryMetadataToSave(run)) {
        assignNecessaryMetadataToRun(run);
      }

      return Database.saveProject(run).
        then(self.assignCurrentRun);
    };

    self.deleteRun = function saveRun (run) {
      return Database.removeProject(run);
    };


    // running / verifying / updating

    self.verifyRun = function (protocol, transcripticProject) {
      var run = createNewRunObject(protocol);

      if (_.isEmpty(run.autoprotocol)) {
        return $q.reject(null);
      }

      return Run.verify({
        title   : 'Verification of ' + protocol.metadata.name + ' - ' + Date.now(),
        protocol: run.autoprotocol
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

          //todo - transition to metadata for these

          _.assign(run, {
            transcripticProjectId: transcripticProject,
            transcripticRunId    : submissionResult.id,
            transcripticRunInfo  : _.cloneDeep(submissionResult)
          });

          //note - firebase
          return self.saveRun(run)
            .then(_.partial($q.when, submissionResult));

        }, function (submissionFailure) {
          console.warn('run failure', submissionFailure);
          return $q.reject(submissionFailure);
        });
    };

    self.updateRunInfo = function (runObj) {
      var runId        = _.result(runObj, 'transcripticRunId'),
          projectId    = _.result(runObj, 'transcripticProjectId'),
          runData      = _.result(runObj, 'data'),
          runInfo      = _.result(runObj, 'transcripticRunInfo'),
          runStatus    = _.result(runInfo, 'status', ''),
          runCompleted = (runStatus == 'complete'),
          runCancelled = (runStatus == 'cancelled');

      console.log(_.isUndefined(runInfo), _.isEmpty(runData), !runCompleted, runId, projectId, runData, runObj);

      if ((_.isUndefined(runInfo) || _.isEmpty(runData) || !runCompleted) && !runCancelled && (runId && projectId)) {
        var requestPayload = {project: projectId, run: runId};
        console.log('getting info');
        return Run.view(requestPayload)
          .$promise
          .then(function updateRunInfoSuccess (runInfo) {

            //todo - transition to metadata for these

            return _.assign(runObj, {
              transcripticRunInfo: runInfo
            });
          })
          .then(self.saveRun)
          .then(function () {
            var runInfo      = _.result(runObj, 'transcripticRunInfo'),
                runStatus    = _.result(runInfo, 'status', ''),
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


    // helpers //

    self.clearIdentifyingInfo = function (run) {
      return _.assign(run.metadata, generateNewRunMetadata());
    };

    function createNewRunObject (protocol) {
      var run = _.assign(Omniprotocol.utils.getScaffoldRun(), {
        protocol    : _.cloneDeep(protocol),
        autoprotocol: ProtocolHelper.convertToAutoprotocol(protocol)
      });

      //assign metadata
      _.assign(run.metadata, generateNewRunMetadata(protocol), run.metadata);

      return run;
    }

    //todo - handle tags + versioning
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
        },
        "tags"  : [],
        "db"    : {}
      }
    }

    function assignNecessaryMetadataToRun (runObj) {
      return _.assign(runObj.metadata, generateNewRunMetadata(runObj.protocol), runObj.metadata);
    }

    function runHasNecessaryMetadataToSave (runObj) {
      return _.every(['id', 'name', 'type', 'author', 'protocol'], function (field) {
        return !_.isUndefined(_.result(runObj.metadata, field));
      });
    }

    //watch for auth changes
    Authentication.watch(function (creds) {
      self.assignCurrentRun({});
    });

  });
