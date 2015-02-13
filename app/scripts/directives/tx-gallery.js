'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 * # txGallery
 */
angular.module('transcripticApp')
  .directive('txGallery', function () {
    return {
      templateUrl: 'views/tx-gallery.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {}
    };
  });
