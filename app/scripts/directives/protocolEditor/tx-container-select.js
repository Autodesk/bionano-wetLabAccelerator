'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txContainerSelect
 * @description
 * # txContainerSelect
 */
angular.module('transcripticApp')
  .directive('txContainerSelect', function ($rootScope, $timeout, ContainerHelper, ProtocolHelper, ProtocolUtils, UUIDGen) {
    return {
      templateUrl     : 'views/tx-container-select.html',
      restrict        : 'E',
      require         : 'ngModel',
      scope           : {
        paramId: '=', //use this instead of 'parameter' because don't want to set 'parameter' on the field (or will be handled as such, not as container)
        type   : '=?containerType',
        model  : '=ngModel'
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
          var relevantParam = ProtocolUtils.paramById(self.paramId);
          if (relevantParam) {
            self.model = _.result(relevantParam, 'name');
            self.type = _.result(relevantParam, 'value.type');
            self.color = _.result(relevantParam, 'value.color');
          } else {
            //try getting by name...
            relevantParam = ProtocolUtils.paramByName(self.model);

            self.type = _.result(relevantParam, 'value.type');
            self.color = _.result(relevantParam, 'value.color');

            //reset model if parameter was bound, but no longer is (container was deleted)
            if (angular.isDefined(self.paramId) && _.isUndefined(relevantParam)) {
              self.model = undefined;
              delete self.paramId;
            }
          }
        };
      },
      link            : function postLink (scope, element, attrs, ngModel) {

        //listen for changes so that can propagate container type
        scope.$watch('containerSelectCtrl.model', scope.containerSelectCtrl.handleChange);

        //listen to changes to parameters
        scope.$on('editor:containerChange', scope.containerSelectCtrl.handleChange);

        //todo - handle differently (see also protocol-field)
        //note - this is run before value is set on model, so timeout
        scope.$on('editor:parameterNameChange', function () {
          $timeout(function () {
            var relevantParam               = ProtocolUtils.paramById(scope.containerSelectCtrl.paramId);
            scope.containerSelectCtrl.model = _.result(relevantParam, 'name');
          });
        });

        scope.selectLocalContainer = selectContainerParam;

        //todo - move to protocolUtils?
        scope.createNewContainer = function (newCont) {
          var param = {
            id   : UUIDGen(),
            name : "myContainer",
            type : 'container',
            value: {
              type: newCont.shortname
            }
          };

          $rootScope.$broadcast('editor:protocol:addContainer', param);

          //hack-ish...
          $timeout(function () {
            selectContainerParam(param);
          });
        };

        function selectContainerParam (param) {
          scope.containerSelectCtrl.paramId = param.id;
          setContainerName(param.name);
        }

        function setContainerName (name) {
          ngModel.$setViewValue(name);
          scope.showingContainers = false;
        }

        //in case container parameter id  undefined, this will work if they haven't changed the name of the parameter
        if (_.isUndefined(scope.containerSelectCtrl.paramId)) {
          var param            = ProtocolUtils.paramByName(scope.containerSelectCtrl.model);
          scope.containerSelectCtrl.paramId = _.result(param, 'id');
        }
      }
    };
  });
