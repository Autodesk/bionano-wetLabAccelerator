'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProjectlist
 * @description
 * # txProjectlist
 */
angular.module('transcripticApp')
  .directive('txProjectlist', function (Project, Auth) {
    return {
      templateUrl: 'views/tx-projectlist.html',
      restrict: 'E',
      controllerAs: 'projCtrl',
      require: 'ngModel', //use ng-model so can be undefined without problems
      link: function (scope, element, attrs, ngModelCtrl) {
        scope.addProject = function (name) {
          Project.create({}, {name: name}).$promise.
          then(function () {
            scope.projects = Project.list();
          });
        };

        scope.selectProject = function (proj) {
          scope.selectedProject = proj;
          ngModelCtrl.$setViewValue(proj);
        };

        Auth.watch(function () {
          scope.projects = Project.list();
        });
      }
    };
  });
