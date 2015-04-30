'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.RunHelper
 * @description
 * # RunHelper
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('RunHelper', function ($q, simpleLogin, FBProfile, Omniprotocol) {

    var self = this;

    self.runs = [];
    self.currentRun = {};

    self.createRun = function (protocol) {
      var run = _.assign(Omniprotocol.utils.getScaffoldRun(), {
        parameters : _.cloneDeep(protocol.parameters)
      });

      //assign metadata
      _.assign(run.metadata, {
        date : (new Date()).valueOf(),
        protocol : {
          name : protocol.metadata.name,
          id : protocol.metadata.id,
          author: "todo"
        },
        author : {
          'todo' : 'todo'
        }
      });

      //todo - run it and get an id from transcriptic
    };

    self.assignCurrentRun = function (inputRun) {
      _.assign(self.currentRun, Omniprotocol.utils.getScaffoldRun(), inputRun)
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
