'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 *
 */
angular.module('transcripticApp')
  .directive('txContentMenu', function (ProtocolHelper, RunHelper, Authentication, Database, $document, $timeout, $location) {
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

        Authentication.watch(function (creds) {
          self.loadingContent = true;
          if (creds) {
            Database.getAllProjectMetadata()
              .then(function (metadatas) {
                $scope.$applyAsync(_.partial(setProjects, metadatas));
              })
              .catch(function (err) {
                console.warn(err);
              });
          } else {
            setProjects([])
          }
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

          ProtocolHelper.getProtocol(protocol)
            .then(_.cloneDeep)
            .then(ProtocolHelper.assignCurrentProtocol)
            .then(function () {
              $location.path('/protocol');
            });
        };

        self.openRun = function (run) {
          self.toggleMenuVisible(false);

          RunHelper.getRun(run)
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
