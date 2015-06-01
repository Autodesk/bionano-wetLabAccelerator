'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 *
 */
angular.module('transcripticApp')
  .directive('txContentMenu', function (ProtocolHelper, RunHelper, Authentication, Database, $location) {
    return {
      templateUrl : 'views/tx-content-menu.html',
      restrict    : 'E',
      controllerAs: 'contentCtrl',
      controller  : function postLink ($scope, $element, $attrs) {
        var self = this;

        self.toggleGalleryVisible = function toggleGalleryVisible (forceVal) {
          $scope.$applyAsync(function () {
            self.isVisible = _.isBoolean(forceVal) ? forceVal : !self.isVisible;
            $element.toggleClass('visible', self.isVisible);
          });
        };

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
          self.toggleGalleryVisible(false);

          ProtocolHelper.getProtocol(protocol)
            .then(ProtocolHelper.assignCurrentProtocol)
            .then(function () {
              $location.path('/protocol');
            })
        };

        self.openRun = function (run) {
          self.toggleGalleryVisible(false);

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
      },
      link        : function postLink (scope, element, attrs) {


      }
    };
  });
