/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txProtocolMini
 * @description
 * # txProtocolMini
 * //note - jquery use
 */
angular.module('wetLabAccelerator')
  .directive('txProtocolMini', function ($timeout, $q, Omniprotocol) {
    return {
      templateUrl     : 'views/tx-protocol-mini.html',
      restrict        : 'E',
      scope           : {
        status          : '=?', //status instruction visibility (provide as object in form {status, message}
        protocol        : '=',
        currentOperation: '=?',
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

        scope.handleStepSelect = function ($event, groupIndex, stepIndex, loopIndex) {
          hasInteracted = true;
          activateStep(groupIndex, stepIndex, loopIndex);
        };

        scope.handleStatusSelect = function ($event) {
          hasInteracted = true;
          var target = $('.status-instruction');
          attractArrow(target);
          activateStatus();
        };

        function activateStep (groupIndex, stepIndex, loopIndex) {
          groupIndex = groupIndex || 0;
          stepIndex  = stepIndex || 0;
          loopIndex  = loopIndex || 0;

          var protocol            = scope.miniCtrl.protocol,
              unfolded            = Omniprotocol.utils.getUnfoldedStepNumber(protocol, groupIndex, stepIndex, loopIndex),
              instructionElements = element.find('.protocol-instruction'),
              el                  = instructionElements[unfolded];

          scope.miniCtrl.currentOperation = {
            group   : groupIndex,
            step    : stepIndex,
            loop    : loopIndex,
            unfolded: unfolded
          };

          attractArrow(el);
        }

        function attractArrow (targetEl) {
          if (_.isUndefined(targetEl)) {
            return;
          }

          var topFromPage  = $(targetEl).offset().top,
              miniFromPage = element.offset().top,
              paddingTop   = parseInt(element.css('padding-top'), 10),
              diff         = topFromPage - miniFromPage - paddingTop;

          scope.arrowTranslate = diff;
        }

        function activateStepFromUnfolded (unfolded) {
          var info = Omniprotocol.utils.getFoldedStepInfo(scope.miniCtrl.protocol, unfolded);
          activateStep(info.group, info.step, info.loop);
        }

        function activateStatus () {
          scope.miniCtrl.currentOperation = 'status';
        }

        /*
        //init
        //fixme - is updating indices even when cancel $timeout.. increases once with each mouseenter
        if (angular.isDefined(attrs['autoScroll']) && angular.isDefined(scope.miniCtrl.protocol)) {
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
        */
      }
    };
  });
