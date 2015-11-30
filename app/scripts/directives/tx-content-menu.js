'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txGallery
 * @description
 *
 */
angular.module('wetLabAccelerator')
  .directive('txContentMenu', function (ProtocolHelper, RunHelper, Authentication, Database, $document, $timeout, $location, $q, $http) {
    return {
      templateUrl : 'views/tx-content-menu.html',
      restrict    : 'E',
      controllerAs: 'contentCtrl',
      controller  : function postLink ($scope, $element, $attrs) {
        var self = this;

        self.toggleMenuVisible = function toggleGalleryVisible (forceVal) {
          $scope.$applyAsync(function () {
            self.isVisible = _.isBoolean(forceVal) ? forceVal : !self.isVisible;
          });
        };

        $scope.$watch('contentCtrl.isVisible', function (newval) {
          $element.toggleClass('visible', newval);
          $timeout(function () {
            $document[newval ? 'on' : 'off']('click', outsideClickListener);
          });
        });

        Authentication.watch(function () {
          Database.getAllProjects()
            .then(function (projects) {
              $scope.$applyAsync(_.partial(setProjects, projects));
            })
            .catch(function (err) {
              console.warn(err);
            });
        });

        function setProjects (projects) {

          self.projects = _.uniq(projects);

          self.protocols = _.filter(self.projects, function (proj) {
            return _.result(proj, 'metadata.type') == 'protocol';
          });

          self.runs = _.filter(self.projects, function (proj) {
            return _.result(proj, 'metadata.type') == 'run';
          });

          self.loadingContent = false;
        }

        self.openProtocol = function (protocol) {
          self.toggleMenuVisible(false);

          var protocolPromise;

          if (protocol.demo === true) {
            console.log('demo!');
            protocolPromise = getLocalProject(_.result(protocol, 'metadata.id'), false);
          } else {
            protocolPromise = ProtocolHelper.getProtocol(protocol);
          }

          protocolPromise.then(_.cloneDeep)
            .then(ProtocolHelper.assignCurrentProtocol)
            .then(function () {
              $location.path('/protocol');
            });
        };

        self.openRun = function (run) {
          self.toggleMenuVisible(false);

          var runPromise;

          if (run.demo === true) {
            console.log('demo!');
            runPromise = getLocalProject(_.result(run, 'metadata.id'), false);
          } else {
            runPromise = RunHelper.getRun(run);
          }

          runPromise
            //don't need to clone run, since not really editable... (except metadata, which saves automatically)
            .then(RunHelper.assignCurrentRun)
            .then(function () {
              $location.path('/results');
            });
        };

        self.createNewProtocol = function () {
          ProtocolHelper.addProtocol()
            .then(self.openProtocol);
        };

        function outsideClickListener (event) {
          if (!$element[0].contains(event.target)) {
            event.preventDefault();
            self.toggleMenuVisible(false);
          }
        }
      },
      link        : function postLink (scope, element, attrs) {


      }
    };
  });
