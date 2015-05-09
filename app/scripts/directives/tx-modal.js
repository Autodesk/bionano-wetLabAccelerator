'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txModal
 * @description
 * # txModal
 */
angular.module('transcripticApp')
  .directive('txModal', function () {
      return {
        templateUrl: 'views/tx-modal.html',
        restrict: 'E',
        scope: {
          ngShow: '=',
          title: '@?'
        },
        transclude: true,
        link: function(scope, element, attrs) {
          scope.dialogStyle = {};
          if (attrs.top) {
            scope.dialogStyle.top = attrs.top;
          }
          if (attrs.height) {
            scope.dialogStyle.height = attrs.height;
          }
          scope.hideModal = function() {
            scope.ngShow = false;
          };
        }
      };

  });
