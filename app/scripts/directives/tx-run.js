'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txRun
 * @description
 * # txRun
 */
angular.module('transcripticApp')
  .directive('txRun', function () {
    return {
      templateUrl: 'views/tx-run.html',
      restrict: 'E',
      scope: {
        versions: '='
      },
      bindToController: true,
      controllerAs: 'historyCtrl',
      controller: function ($scope, $element, $attrs) {

        var self = this;
        /*this.versions = _.map(_.range(10), function(x) {
          return +Date.now() - (10000000 * x)

          this.versions = _.map(_.sortByAll(this.versions), _.values);
         console.log(this);
        });*/



      },
      link: function(scope, element, attrs) {


      }
    };

  });
