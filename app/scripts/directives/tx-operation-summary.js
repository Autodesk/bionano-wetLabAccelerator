'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperationSummary
 * @description
 * # txOperationSummary
 */
angular.module('transcripticApp')
  .directive('txOperationSummary', function ($http, $compile) {
    return {
      restrict        : 'E',
      scope           : {
        protocol: '=',
        indices : '=' //object with keys group, step, loop, unfolded (optional)
        //attr auto-scroll
      },
      bindToController: true,
      controllerAs    : 'summaryCtrl',
      controller      : function protocolMiniController ($scope, $element, $attrs) {
        var self = this;
      },
      link            : function (scope, element, attrs) {

        scope.$watch('summaryCtrl.protocol', handleInputChange);
        scope.$watch('summaryCtrl.indices', handleInputChange);


        function handleInputChange () {
          var indices  = scope.summaryCtrl.indices,
              protocol = scope.summaryCtrl.protocol;

          if (_.isEmpty(protocol) || _.isEmpty(indices)) {
            element.html('');
            return;
          }

          var groupNum = _.result(indices, 'group', 0),
              stepNum  = _.result(indices, 'step', 0),
              op       = protocol.groups[groupNum].steps[stepNum],
              partial  = op.operation;

          $http.get('views/datavis/' + partial + '.html', {cache: true}).
            success(function (data) {
              var $el = angular.element(data);
              element.html($compile($el)(scope));
            });
        }
      }
    };
  });
