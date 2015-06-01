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
          creds && Database.getAllProjectMetadata()
            .then(function (projects) {

              self.projects = _(projects).uniq().value();

              self.protocols = _.filter(self.projects, function (proj) {
                return _.result(proj, 'metadata.type') == 'protocol';
              });

              self.runs = _.filter(self.projects, function (proj) {
                return _.result(proj, 'metadata.type') == 'run';
              });

            })
            .catch(function (err) {
              console.warn(err);
            })
        });

        self.openProtocol = function (protocol) {
          self.toggleMenuVisible(false);
          
          ProtocolHelper.getProtocol(protocol)
            .then(ProtocolHelper.assignCurrentProtocol)
            .then(function () {
              $location.path('/protocol');
            });
        };

        self.openRun = function (run) {
          self.toggleMenuVisible(false);
          
          RunHelper.getRun(run)
            .then(RunHelper.assignCurrentRun(run))
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
