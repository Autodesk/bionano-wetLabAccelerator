'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txContainerSelect
 * @description
 * # txContainerSelect
 */
angular.module('transcripticApp')
  .directive('txContainerSelect', function ($rootScope, $timeout, ContainerHelper, ProtocolHelper) {
    return {
      templateUrl     : 'views/tx-container-select.html',
      restrict        : 'E',
      require         : 'ngModel',
      scope           : {
        //containers: '=',
        type : '=?containerType',
        model: '=ngModel'
      },
      bindToController: true,
      controllerAs    : 'containerSelectCtrl',
      controller      : function ($scope, $element, $attrs, $transclude) {
        var self = this;

        self.containerOptions = ContainerHelper.containerOptions;
        self.localContainers  = ContainerHelper.local;
        self.remoteContainers = ContainerHelper.remote;

        //expose changes to container-type
        self.handleChange = function () {
          var index   = _.findIndex(self.localContainers, function (container) {
                return container.name == self.model && (_.isString(container.name) && container.name.length);
              }),
              contVal = _.result(self.localContainers[index], 'value');

          if (index >= 0) {
            self.type = _.result(contVal, 'type');
          }
        };

        self.handleNameChange = function (e, oldName, newName) {
          if (_.isString(oldName) && oldName.length && self.model == oldName) {
            self.model = newName;
          }
        };
      },
      link            : function postLink (scope, element, attrs, ngModel) {
        // Set up our own watch to listen for both changes in and changes out. ng-change is view change listener so doesn't work here.
        // Need to also handle changes from upstream e.g. the user changing the JSON
        //todo - can deprecate this if setting ourselves
        scope.$watch('containerSelectCtrl.model', scope.containerSelectCtrl.handleChange);

        //listen to changes to parameters
        scope.$on('editor:containerChange', scope.containerSelectCtrl.handleChange);

        scope.$on('editor:parameterNameChange', scope.containerSelectCtrl.handleNameChange);

        scope.selectLocalContainer = function (localCont) {
          setContainerName(localCont.name);
        };

        scope.createNewContainer = function (newCont) {
          var name  = "myContainer",
              param = {
                name : name,
                type : 'container',
                value: {
                  type: newCont.shortname
                }
              };

          $rootScope.$broadcast('editor:protocol:addContainer', param);

          //hack-ish...
          $timeout(function () {
            setContainerName(name);
          })
        };

        function setContainerName (name) {
          ngModel.$setViewValue(name);
          scope.showingContainers = false;
        }

      }
    };
  });
