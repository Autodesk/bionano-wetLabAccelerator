'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 * Expects gallery items in the form of key-val objects, with (minimally) fields 'name'
 * galleryRollup takes a key to use for the headers, and will group items by that key
 *
 * todo - maybe makes sense to get these items internally? how to link to the rest of the app, handle nav, etc.
 */
angular.module('transcripticApp')
  .directive('txGallery', function () {
    return {
      templateUrl     : 'views/tx-gallery.html',
      restrict        : 'E',
      scope           : {
        galleryItems : '=',
        galleryRollup: '@'
      },
      bindToController: true,
      controllerAs    : 'galleryCtrl',
      controller      : function postLink ($scope, $element, $attrs) {},
      link            : function postLink (scope, element, attrs) {

        scope.$watch('galleryCtrl.galleryRollup', function (newval) {
          scope.galleryCtrl.rolled = _.groupBy(scope.galleryCtrl.galleryItems, newval);
        });

        scope.galleryCtrl.toggleGalleryVisible = function toggleGalleryVisible (forceVal) {
          scope.$applyAsync(function () {
            scope.galleryCtrl.isVisible = _.isBoolean(forceVal) ? forceVal : element.find('#menu-trigger')[0].checked;
            element.toggleClass('visible', scope.galleryCtrl.isVisible);
          });
        };
      }
    };
  });
