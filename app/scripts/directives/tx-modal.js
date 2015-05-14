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
      restrict   : 'E',
      scope      : {
        ngShow : '=',
        title  : '@?',
        onClose: '&?'
      },
      transclude : true,
      link       : function (scope, element, attrs, ctrl, transcludeFn) {

        scope.dialogStyle = {};
        if (attrs.top) {
          scope.dialogStyle.top = attrs.top;
        }
        if (attrs.height) {
          scope.dialogStyle.height = attrs.height;
        }

        scope.hideModal = function () {
          angular.isFunction(scope.onClose) && scope.onClose();
          scope.ngShow = false;

          transcludeFn(function (clone, scope) {
            console.log(scope);
            _.attempt(scope.$onClose);
          });
        };

        //can't use ng-transclude and update the scope, so add the element manually
        transcludeFn(function (clone, transcludeScope) {
          var transcludeEl       = element.find('modal-transclude');
          transcludeEl.empty();
          transcludeEl.append(clone);
          transcludeScope.$close = scope.hideModal;
        });
      }
    };

  });
