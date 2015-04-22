'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolMini
 * @description
 * # txProtocolMini
 */
angular.module('transcripticApp')
  .directive('txProtocolMini', function (Omniprotocol) {
    return {
      templateUrl: 'views/datavis/tx-protocol-mini.html',
      restrict: 'E',
      scope: {
        protocol : '=',
        currentOperation: '=',
        showTimelines: '='
      },
      bindToController: true,
      controllerAs : 'miniCtrl',
      controller: function protocolMiniController($scope, $element, $attrs) {
        var self = this;

        this.createGroupRepeater = function (groupLoopNum) {
          //todo - check for group is active, 1 if not
          return _.range(groupLoopNum);
        };

        //step tracking
        this.stepUnfolded = 0;

        $scope.$watch(function () {
          return self.stepUnfolded;
        }, function (unfolded) {
          self.stepFolded = Omniprotocol.utils.getFoldedStepNumber(unfolded);
        });

      },
      link: function postLink(scope, element, attrs) {
        var arrowEl = element.find('.mini-arrow'); //note - jquery

        scope.attractArrow = function ($event) {
          var target = $event.target,
              topFromPage = target.getBoundingClientRect().top,
              miniFromPage = element[0].getBoundingClientRect().top,
              diff = topFromPage - miniFromPage;

          arrowEl.css({'top': diff});
        };

        //todo
        function activateStep (groupIndex, stepIndex) {
          var flat = Omniprotocol.utils.getFoldedStepNumber(groupIndex, stepIndex);
          console.log(flat);
        }
      }
    };
  });
