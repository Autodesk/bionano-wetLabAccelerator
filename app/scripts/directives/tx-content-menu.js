'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 *
 */
angular.module('transcripticApp')
  .directive('txContentMenu', function (ProtocolHelper, RunHelper, $location) {
    return {
      templateUrl     : 'views/tx-content-menu.html',
      restrict        : 'E',
      controllerAs    : 'contentCtrl',
      controller      : function postLink ($scope, $element, $attrs) {
        var self = this;

        self.toggleGalleryVisible = function toggleGalleryVisible (forceVal) {
          $scope.$applyAsync(function () {
            self.isVisible = _.isBoolean(forceVal) ? forceVal : !self.isVisible;
            $element.toggleClass('visible', self.isVisible);
          });
        };

        self.protocols = ProtocolHelper.protocols;

        self.runs = RunHelper.runs;

        self.openProtocol = function (protocol) {
          self.toggleGalleryVisible(false);
          $location.path('/build');
          ProtocolHelper.assignCurrentProtocol(protocol);
        };

        self.openRun = function (run) {
          self.toggleGalleryVisible(false);
          $location.path('/results');
          RunHelper.assignCurrentRun(run);
        };

        self.createNewProtocol = function () {
          ProtocolHelper.addProtocol()
            .then(self.openProtocol);
        };
      },
      link            : function postLink (scope, element, attrs) {

        /*scope.$watch('galleryCtrl.galleryRollup', function (newval) {
          scope.galleryCtrl.rolled = _.groupBy(scope.galleryCtrl.galleryItems, newval);
        });*/
      }
    };
  });
