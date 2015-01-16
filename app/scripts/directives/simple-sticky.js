/**
 * @ngdoc directive
 * @name simple-sticky
 *
 * @description
 * Simple directive to create a sticky div, which will remain fixed relative to the top of the page.
 *
 * Each time the directive is used, the callbacks will be folded into a throttled pipeline (50ms)
 *
 * note - requires lodash throttle() and remove()
 *
 * @attr simpleSticky {number} number of pixels from top
 *
 * @example
 *
 * <div class="myStickyDiv" simple-sticky="20"></div>
 */

angular.module('transcripticApp')
  .directive('simpleSticky', function ($window) {

    var windowEl = angular.element($window);

    var checks = [];

    function getYOffset() {
      return (angular.isDefined($window.pageYOffset) ?
        $window.pageYOffset :
        $window.document[0].documentElement.scrollTop);
    }

    //the function will be run
    function addCheck(fn, $scope) {
      checks.push(fn);
      $scope.$on('$destroy', removeCheck);
    }

    function removeCheck(fn) {
      _.remove(checks, fn);
    }

    var throttleRunChecks = _.throttle(function () {
      var pageYOffset = getYOffset();

      angular.forEach(checks, function (fn) {
        fn.apply(null, [pageYOffset]);
      });
    }, 50);

    windowEl.on('scroll resize', throttleRunChecks);

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var showFromTopSticky = parseInt(attrs.simpleSticky, 10) || 20,
          positionNormal = element.css('position'),
          showFromTopNormal = element.css('top'),
          startFromTop = element[0].getBoundingClientRect().top + getYOffset(),
          isAffixed;

        //check if affix state has changed
        function checkPosition(pageYOffset) {
          var shouldAffix = (pageYOffset + showFromTopSticky) > startFromTop;

          if (shouldAffix !== isAffixed) {
            isAffixed = shouldAffix;
            handleAffixing(shouldAffix);
          }
        }

        //handle class changes, CSS changes
        function handleAffixing(shouldAffix) {
          if (shouldAffix) {
            //don't worry - we are't triggering paint storms because these only run when cross threshold (transform
            // isn't really appropriate)
            element.css({
              top: showFromTopSticky + 'px',
              position: "fixed"
            });
          } else {
            element.css({
              top: showFromTopNormal,
              position: positionNormal
            });
          }
          //element.toggleClass('affix', shouldAffix)
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
