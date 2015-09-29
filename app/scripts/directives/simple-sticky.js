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
 * @attr sticky-class {string} toggle a class on the element
 * @attr potentially-tallest {number} flag in case element might be tallest in the page. Fixing will change page height + cause jank. Give number for extra space to accommodate.
 *
 * @example
 *
 * <div class="myStickyDiv" simple-sticky="20" sticky-bottom></div>
 */
  //todo - attr.alignWith to give element to match?
angular.module('wetLabAccelerator')
  .directive('simpleSticky', function ($window, $document, $timeout) {

    var windowEl = angular.element($window);

    var checks = [];

    function getYOffset () {
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
    function addCheck (fn, $scope) {
      checks.push(fn);
      $scope.$on('$destroy', _.partial(removeCheck, fn));
    }

    function removeCheck (fn) {
      //_.remove will run function if passed, not find the function
      checks.splice(_.indexOf(checks, fn), 1);
    }

    //ideally, throttle to rAF (try angular service?)
    var throttleRunChecks = _.throttle(function () {
      var pageYOffset = getYOffset();

      angular.forEach(checks, function (fn) {
        fn.apply(null, [pageYOffset]);
      });
    }, 16);

    windowEl.on('scroll resize', throttleRunChecks);

    return {
      restrict: 'A',
      link    : function (scope, element, attrs) {

        var affixToBottom  = angular.isDefined(attrs.stickyBottom),
            fromEdgeAffix  = parseInt(attrs.simpleSticky, 10) || 20,
            positionNormal = element.css('position'),
            fromEdgeNormal = element.css(affixToBottom ? 'bottom' : 'top'),
            fromEdgeStart  = calcStartFromEdge(element[0], affixToBottom),//this doesn't work great with flexbox layouts...
            isAffixed      = false,
            shouldCheck    = false,
            elHeight = element.height() + (parseInt(attrs.potentiallyTallest, 10) || 0);

        //hack to handle flexbox layout... timeout to run after initial check
        //especially should run if fromEdgeStart == 0
        $timeout(function () {
          shouldCheck = true;
        }, 50);

        var heightChecker = function () {
          elHeight = element.height() + (parseInt(attrs.potentiallyTallest, 10) || 0)
        };

        if (angular.isDefined(attrs.potentiallyTallest)) {
          $timeout(heightChecker, 50);
          //todo - ideally, would only run on resize
          addCheck(heightChecker, scope);
        }

        //check if affix state has changed
        var positionChecker = function checkPosition (pageYOffset, forceCheck) {

          //console.log(element.height(), elHeight, $window.innerHeight, pageYOffset + fromEdgeAffix, fromEdgeStart);
          //console.log(fromEdgeStart, element[0].getBoundingClientRect().top, getYOffset(), element[0].getBoundingClientRect().top  + getYOffset(), pageYOffset, fromEdgeAffix, pageYOffset + fromEdgeAffix, (pageYOffset + fromEdgeAffix) > fromEdgeStart);

          if (shouldCheck || !!forceCheck) {
            fromEdgeStart = calcStartFromEdge(element[0], affixToBottom);
            shouldCheck   = false;
          }

          if (elHeight > $document[0].body.getBoundingClientRect().height) {
            return;
          }

          var shouldAffix;

          if (affixToBottom) {
            shouldAffix = ($window.innerHeight + pageYOffset) < fromEdgeStart;
          } else {
            shouldAffix = (
                //check past threshold
              (pageYOffset + fromEdgeAffix) > fromEdgeStart) &&
                //check at page top
              (pageYOffset > Math.min(10, fromEdgeAffix) );
          }

          if (shouldAffix !== isAffixed) {
            handleAffixing(shouldAffix);

            //run a check in case elements have changed in page, don't wanna run too often
            //todo - time this better
            if (!shouldAffix && !isAffixed) {
              shouldCheck = true;
            }
          }
        };

        //handle class changes, CSS changes
        function handleAffixing (shouldAffix) {
          isAffixed = shouldAffix;

          var styleObj = {
            position: shouldAffix ? "fixed" : positionNormal
          };

          //praying for computed properties...
          styleObj[affixToBottom ? 'bottom' : 'top'] = shouldAffix ? fromEdgeAffix + 'px' : fromEdgeNormal;

          element.css(styleObj);

          if (angular.isDefined(attrs.stickyClass)) {
            var stickyClass = !!attrs.stickyClass ? attrs.stickyClass : 'sticky';
            element.toggleClass(stickyClass, shouldAffix);
          }
        }

        //register a callback, handles deregistration when pass in scope
        addCheck(positionChecker, scope);

        //init
        positionChecker(null);
      }
    };
  });
