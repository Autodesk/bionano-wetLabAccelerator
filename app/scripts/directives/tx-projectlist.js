'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProjectlist
 * @description
 * # txProjectlist
 */
angular.module('transcripticApp')
  .directive('txProjectlist', function (Project, Auth, $timeout) {
    return {
      templateUrl: 'views/tx-projectlist.html',
      restrict: 'E',
      controllerAs: 'projCtrl',
      require: 'ngModel', //use ng-model so can be undefined without problems
      link: function (scope, element, attrs, ngModelCtrl) {
        scope.addProject = function (name) {
          Project.create({}, {name: name}).$promise.
          then(function () {
            scope.projects = [];
            //hack -- doesn't refresh immediately so lets wait a sec
            $timeout(function () {
              scope.projects = Project.list();
            }, 250);
          });
        };

        scope.selectProject = function (proj) {
          scope.selectedProject = proj;
          ngModelCtrl.$setViewValue(proj);
        };

        scope.deleteProject = function (id) {
          Project.remove({project: id}).$promise.
          then(function () {
            scope.projects = Project.list();
          });
        };

        Auth.watch(function () {
          scope.projects = Project.list();
        });
      }
    };
  });
