'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txModal
 * @description
 * # txModal
 *
 * can use function scope.$close to close the modal, or you can add a function scope.$onClose() to run when closing the modal
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
          _.attempt(scope.onClose);
          scope.ngShow = false;

          transcludeFn(function (clone, transcludeScope) {
            _.attempt(transcludeScope.$onClose);
          });
        };

        /*
        //todo - this causes double linking... for some reason, we dont need this and it just happens magically...
        //can't use ng-transclude and update the scope, so add the element manually
        transcludeFn(scope.$parent, function (clone, transcludeScope) {
          var transcludeEl       = element.find('modal-transclude');
          transcludeEl.empty();
          transcludeEl.append(clone);
          transcludeScope.$close = scope.hideModal;
        });
        */
      }
    };

  });
