'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txRun
 * @description
 * # txRun
 * //todo - maybe should move verifications / submissions outside of here entirely. also maybe the remote verification listener
 */
angular.module('transcripticApp')
  .directive('txRun', function ($q, $timeout, $rootScope, TranscripticAuth, Autoprotocol, Omniprotocol, Run, Project, ProtocolHelper, Communication, RunHelper, Notify) {
    return {
      templateUrl : 'views/tx-run.html',
      restrict    : 'E',
      scope       : true,
      controllerAs: 'runCtrl',
      controller  : function ($scope, $element, $attrs) {

        var self = this;

        self.protocol = ProtocolHelper.currentProtocol;

        self.projects = [];

        TranscripticAuth.watch(function (info) {
          self.transcripticAuth = info;
          if (_.result(info, 'organization', false)) {
            self.projects = Project.list();
          }
        });

        self.selectProject = function (proj) {
          $scope.creatingNewProject = false;
          self.project              = proj;
        };

        self.findProjectByname = function (projectName) {
          return _.find(self.projects, _.matches({name: projectName}));
        };


        self.analyze = _.partial(submitHelper, false);
        self.submit  = _.partial(submitHelper, true);

        self.startRun = function () {
          self.analyze(null, false);
        };

        //requires a project object and response
        self.transcripticLink = function () {
          if (_.isEmpty(self.response) || !self.response.id) {
            return null;
          }

          return Communication.transcripticRoot +
            TranscripticAuth.organization() +
            '/' + self.project.url +
            '/runs/' + self.response.id;
        };

        function submitHelper (isRun, forceProject, closeModal) {

          var funcToRun = isRun ? RunHelper.createRun : RunHelper.verifyRun,
              project   = _.isEmpty(forceProject) ? self.project : forceProject;

          self.processing = true;

          var projectIdPromise;

          //runCtrl.project can be a string (if creating new) or an object (selected one)
          if (_.isObject(project) && _.has(project, 'id')) {
            projectIdPromise = $q.when(project);
          }
          //if edited project from dropdown, and not an object
          else {
            var found = self.findProjectByname(project);
            //first check and make sure not in projects
            if (_.isObject(found) && _.has(found, 'id')) {
              projectIdPromise = $q.when(found);
            }
            //create it and then use for posting later
            else {
              projectIdPromise = Project.create({name: project}).$promise.then(function (project) {

                //hack - force an update (maybe move to service? use this so rarely...)
                $timeout(function () {
                  self.projects = Project.list();
                }, 250);

                return project;
              });
            }
          }

          $rootScope.$broadcast('editor:clearVerifications');

          return projectIdPromise
            .then(function (project) {
              self.project = project;

              return funcToRun(self.protocol, project.id)
                .then(function runSuccess (d) {
                  console.log(d);
                  self.response = d;
                  self.error    = false;

                  if (isRun) {
                    $rootScope.$broadcast('editor:runSubmitted', d);
                  } else {
                    $rootScope.$broadcast('editor:verificationSuccess', d);
                  }

                }, function runFailure (e) {
                  console.log(e);

                  //check for our own handling... pas null if conversion didn't work, and will handle local errors upstream
                  if (_.isNull(e)) {
                    return;
                  }

                  self.error = true;

                  //use as simple check for something like a 404 error - i.e. not protocol error but $http error
                  if (_.isEmpty(e.data) || _.isEmpty(e.data.protocol)) {
                    self.response = {"error": "Request did not go through... check the console"};
                  } else {
                    $rootScope.$broadcast('editor:verificationFailure', e.data.protocol);
                    self.response = e.data.protocol;
                  }
                });
            })
            .catch(function (err) {
              console.warn('error sending run', err);
              if (err.status == 401) {
                Notify({
                  message: 'You must provide your Transcriptic credentials to verify your protocol',
                  error  : true
                });
              } else if (err.status == 0) {
                Notify({
                  message: 'Request timed out. Please try it again.',
                  error  : true
                });
                closeModal = false;
              }
            })
            .then(function () {
              self.processing = false;
              (closeModal !== false) && $rootScope.$broadcast('editor:toggleRunModal', false);
            });
        }

      },
      link        : function (scope, element, attrs) {

        //allow running of a verification from wherever without opening up the modal...
        scope.$on('editor:initiateVerification', function (event) {
          var project = _.result(scope.runCtrl, 'projects[0]', 'Wet Lab Accelerator');

          scope.runCtrl.analyze(project);
        });

        //hack - shouldn't be expecting this to exist
        scope.$parent.$onClose = function () {
          scope.$applyAsync(_.assign(scope.runCtrl, {
            processing: false,
            response  : '',
            runTitle  : '',
            project   : ''
          }));
        };

      }
    };

  });
