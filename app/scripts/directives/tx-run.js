'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txRun
 * @description
 * # txRun
 * //todo - maybe should move verifications / submissions outside of here entirely. also maybe the remote verification listener
 */
angular.module('transcripticApp')
  .directive('txRun', function ($q, $timeout, $rootScope, Auth, Autoprotocol, Omniprotocol, Run, Project, ProtocolHelper, RunHelper) {
    return {
      templateUrl     : 'views/tx-run.html',
      restrict        : 'E',
      scope           : {
        protocolForm: '='
      },
      bindToController: true,
      controllerAs    : 'runCtrl',
      controller      : function ($scope, $element, $attrs) {

        var self = this;

        self.protocol = ProtocolHelper.currentProtocol;

        self.projects = [];

        Auth.watch(function () {
          self.projects = Project.list();
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
          self.analyze();
          self.runWasInitiated = true;
        };

        //requires a project object and response
        self.transcripticLink = function () {
          if (_.isEmpty(self.response) || !self.response.id) { return null; }

          return Communication.transcripticRoot +
            Auth.organization() +
            '/' + self.project.url +
            '/runs/' + self.response.id;
        };


        function submitHelper (isRun, forceProject) {

          var funcToRun = isRun ? RunHelper.createRun : RunHelper.verifyRun,
              project = _.isUndefined(forceProject) ? self.project : forceProject;

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

          projectIdPromise.then(function (project) {
            self.project = project;

            funcToRun(self.protocol, project.id).
              then(function runSuccess (d) {
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

                self.error = true;

                //use as simple check for something like a 404 error - i.e. not protocol error but $http error
                if (angular.isUndefined(e.data) || _.isUndefined(e.data.protocol)) {
                  self.response = {"error": "Request did not go through... check the console"};
                } else {
                  $rootScope.$broadcast('editor:verificationFailure', e.data.protocol);
                  self.response = e.data.protocol;
                }
              })
              .then(function () {
                self.processing = false;
                //todo - close the modal?
                $rootScope.$broadcast('editor:toggleRunModal', false);
              });
          });
        }

      },
      link            : function (scope, element, attrs) {

        //allow running of a verification from wherever without opening up the modal...
        scope.$on('editor:initiateVerification', function (event) {
          var project = _.result(scope.runCtrl, 'projects[0]', 'Wet Lab Accelerator');

          scope.runCtrl.analyze(project);
        });

      }
    };

  });
