'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txContainerSelect
 * @description
 * # txContainerSelect
 */
angular.module('transcripticApp')
  .directive('txContainerSelect', function ($rootScope, ContainerHelper, ProtocolHelper) {
    return {
      template        : '<select ng-model="containerSelectCtrl.model" ng-options="o.name as o.name for o in containerSelectCtrl.localContainers"></select>',
      restrict        : 'E',
      scope           : {
        //containers: '=',
        type : '=?containerType',
        model: '=ngModel'
      },
      bindToController: true,
      controllerAs    : 'containerSelectCtrl',
      controller      : function ($scope, $element, $attrs) {
        var self = this;

        self.localContainers  = ContainerHelper.local;
        self.remoteContainers = ContainerHelper.remote;

        //expose changes to container-type
        self.handleChange = function () {
          var index          = _.findIndex(self.localContainers, function (container) {
                return container.name == self.model;
              }),
              contVal = _.result(self.localContainers[index], 'value');

          //console.log(self.model, contVal);

          if (index >= 0) {
            self.type = _.result(contVal, 'type');
          }
        };
      },
      link            : function postLink (scope, element, attrs, ngModel) {
        // Set up our own watch to listen for both changes in and changes out. ng-change is view change listener so doesn't work here.
        // Need to also handle changes from upstream e.g. the user changing the JSON
        scope.$watch('containerSelectCtrl.model', scope.containerSelectCtrl.handleChange);

        //listen to changes to parameters
        scope.$on('editor:containerChange', scope.containerSelectCtrl.handleChange);

      }
    };
  });
