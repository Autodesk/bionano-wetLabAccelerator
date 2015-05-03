'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolMini
 * @description
 * # txProtocolMini
 * //note - jquery use
 */
angular.module('transcripticApp')
  .directive('txProtocolMini', function ($timeout, $q, Omniprotocol) {
    return {
      templateUrl     : 'views/tx-protocol-mini.html',
      restrict        : 'E',
      scope           : {
        protocol        : '=',
        currentOperation: '=',
        showTimelines   : '=',
        showArrow       : '='
        //attr auto-scroll
      },
      bindToController: true,
      controllerAs    : 'miniCtrl',
      controller      : function protocolMiniController ($scope, $element, $attrs) {
        var self = this;

        this.createGroupRepeater = function (groupLoopNum) {
          //todo - check for group is active, 1 if not
          return _.range(groupLoopNum);
        };

      },
      link            : function postLink (scope, element, attrs) {

        var hasInteracted = false;

        scope.handleMouseover = function ($event, groupIndex, stepIndex, loopIndex) {
          $event.preventDefault();
          $event.stopPropagation();
          hasInteracted = true;
          activateStep(groupIndex, stepIndex, loopIndex);
        };

        function activateStep (groupIndex, stepIndex, loopIndex) {
          groupIndex = groupIndex || 0;
          stepIndex  = stepIndex || 0;
          loopIndex  = loopIndex || 0;

          var protocol            = scope.miniCtrl.protocol,
              unfolded            = Omniprotocol.utils.getUnfoldedStepNumber(protocol, groupIndex, stepIndex, loopIndex),
              instructionElements = element.find('.protocol-instruction'),
              el                  = instructionElements[unfolded];


          //todo - inform results, or just use data binding (set up watch)

          scope.miniCtrl.currentOperation = {
            group   : groupIndex,
            step    : stepIndex,
            loop    : loopIndex,
            unfolded: unfolded
          };

          attractArrow(el);
        }

        function attractArrow (targetEl) {
          var topFromPage  = $(targetEl).offset().top,
              miniFromPage = element.offset().top,
              paddingTop = parseInt(element.css('padding-top'), 10),
              diff         = topFromPage - miniFromPage - paddingTop;

          scope.arrowTranslate = diff;
        }

        function activateStepFromUnfolded (unfolded) {
          var info = Omniprotocol.utils.getFoldedStepInfo(scope.miniCtrl.protocol, unfolded);
          activateStep(info.group, info.step, info.loop);
        }

        //init
        //fixme - is updating indices even when cancel $timeout.. increases once with each mouseenter
        if (angular.isDefined(attrs['autoScroll'])) {
          //initial timeout to ensure protocol is propagated
          $timeout(function () {
            _.reduce(_.range(Omniprotocol.utils.getNumberUnfoldedSteps(scope.miniCtrl.protocol)), function (chain, unfoldedNum) {
              return chain.then(function () {
                return $timeout(function () {
                  !hasInteracted && activateStepFromUnfolded(unfoldedNum);
                }, 1500);
              });
            }, $q.when());
          }, 200);
        }
      }
    };
  });
