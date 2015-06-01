/**
 * @ngdoc directive
 * @name simple-sticky
 *
 * @description
 * Simple directive to create a sticky div, which will remain fixed relative to the top of the page.
 *
 * Each time the directive is used, the callbacks will be folded into a throttled pipeline (50ms)
 *
 * note - requires lodash for throttle() and remove()
 *
 * @attr simpleSticky {number} number of pixels from edge
 *
 * @example
 *
 * <div class="myStickyDiv" simple-sticky="20" sticky-bottom></div>
 */
//todo - attr.alignWith to give element to match?
angular.module('transcripticApp')
  .directive('simpleSticky', function ($window, $timeout) {

    var windowEl = angular.element($window);

    var checks = [];

    function getYOffset() {
      return (angular.isDefined($window.pageYOffset) ?
        $window.pageYOffset :
        $window.document[0].documentElement.scrollTop);
    }

    function calcStartFromEdge (nativeElement, fromBottom) {
      //todo
      if (fromBottom) {

      } else {

      }

      return nativeElement.getBoundingClientRect().top + getYOffset();
    }

    //the function will be run
    function addCheck(fn, $scope) {
      checks.push(fn);
      $scope.$on('$destroy', removeCheck);
    }

    function removeCheck(fn) {
      _.remove(checks, fn);
    }

    //ideally, throttle to rAF (try angular service?)
    var throttleRunChecks = _.throttle(function () {
      var pageYOffset = getYOffset();

      angular.forEach(checks, function (fn) {
        fn.apply(null, [pageYOffset]);
      });
    }, 25);

    windowEl.on('scroll resize', throttleRunChecks);

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var affixToBottom = angular.isDefined(attrs.stickyBottom),
            fromEdgeAffix = parseInt(attrs.simpleSticky, 10) || 20,
            positionNormal = element.css('position'),
            fromEdgeNormal = element.css(affixToBottom ? 'bottom' : 'top'),
            fromEdgeStart = calcStartFromEdge(element[0], affixToBottom),//this doesn't work great with flexbox layouts...
            isAffixed = false,
            shouldCheck = false;

        //hack to handle flexbox layout... timeout to run after initial check
        if (fromEdgeStart == 0) {
          $timeout(function () {
            shouldCheck = true;
          });
        }

        //check if affix state has changed
        function checkPosition(pageYOffset, forceCheck) {

          if (shouldCheck || !!forceCheck) {
            fromEdgeStart = calcStartFromEdge(element[0], affixToBottom);
            shouldCheck = false;
          }

          //console.log(fromEdgeStart, element[0].getBoundingClientRect().top, getYOffset(), element[0].getBoundingClientRect().top  + getYOffset(), pageYOffset, fromEdgeAffix, pageYOffset + fromEdgeAffix, (pageYOffset + fromEdgeAffix) > fromEdgeStart);

          var shouldAffix;

          if (affixToBottom) {
            shouldAffix = ($window.innerHeight + pageYOffset) < fromEdgeStart;
          } else {
            shouldAffix = (pageYOffset + fromEdgeAffix) > fromEdgeStart;
          }

          if (shouldAffix !== isAffixed) {
            handleAffixing(shouldAffix);

            //run a check in case elements have changed in page, don't wanna run too often
            //todo - time this better
            if (!shouldAffix && !isAffixed) {
              shouldCheck = true;
            }
          }
        }

        //handle class changes, CSS changes
        function handleAffixing(shouldAffix) {
          isAffixed = shouldAffix;

          var styleObj = {
            position: shouldAffix ? "fixed" : positionNormal
          };

          //praying for computed properties...
          styleObj[affixToBottom ? 'bottom' : 'top'] = shouldAffix ? fromEdgeAffix + 'px' : fromEdgeNormal;

          element.css(styleObj);
        }

        //register a callback, handles deregistration when pass in scope
        addCheck(function (pageYOffset) {
          checkPosition(pageYOffset);
        }, scope);

        //init
        checkPosition();
      }
    };
  });
