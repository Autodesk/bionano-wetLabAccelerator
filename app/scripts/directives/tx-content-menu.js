'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 *
 */
angular.module('transcripticApp')
  .directive('txContentMenu', function (ProtocolHelper, RunHelper, $document, $timeout, $location) {
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

        self.protocols = ProtocolHelper.protocols;

        self.runs = RunHelper.runs;

        self.openProtocol = function (protocol) {
          self.toggleMenuVisible(false);
          $location.path('/protocol');
          ProtocolHelper.assignCurrentProtocol(protocol);
        };

        self.openRun = function (run) {
          self.toggleMenuVisible(false);
          $location.path('/results');
          RunHelper.assignCurrentRun(run);
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

        /*scope.$watch('galleryCtrl.galleryRollup', function (newval) {
          scope.galleryCtrl.rolled = _.groupBy(scope.galleryCtrl.galleryItems, newval);
        });*/
      }
    };
  });
