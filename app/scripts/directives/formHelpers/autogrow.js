'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:autogrow
 * @description
 * # autogrow
 */
angular.module('transcripticApp')
  .directive('autoGrow', function($timeout) {
    return {
      require: '?ngModel',
      link: function(scope, element, attr, ngModelCtrl){
        var paddingLeft = element.css('paddingLeft'),
            paddingRight = element.css('paddingRight');

        var minWidth = parseInt(attr.autoGrow, 10) || parseInt(element.css('minWidth'), 10) || 50;

        var update = function() {
          var val = element.val()
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
            ;
          var calcWidth;

          // If empty calculate by placeholder
          if (val !== "") {
            calcWidth = val.length * 7 + 15;
          } else {
            calcWidth = element[0].placeholder.length * 7 + 10;
          }

          //extra to handle new letter before next $digest $shadow[0].offsetWidth
          var newWidth = Math.max(calcWidth, minWidth) + "px";
          if (val.length < 26) {
            element.css('width', newWidth);
          }
        };

        if (ngModelCtrl) {
          scope.$watch(function () {
            return ngModelCtrl.$viewValue;
          }, update)
        } else {
          element.bind('keyup keydown blur', update);
        }

        // Update on the first link
        // $timeout is needed because the value of element is updated only after the $digest cycle
        // TODO: Maybe on compile time if we call update we won't need $timeout
        $timeout(update);
      }
    }
  });
