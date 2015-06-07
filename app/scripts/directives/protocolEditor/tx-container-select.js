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
          var relevantParam = ProtocolUtils.paramById(_.result(self.model, 'container'));
          if (relevantParam) {
            //expose type outside directive
            self.type  = _.result(relevantParam, 'value.type');
          }
        };
      },
      link            : function postLink (scope, element, attrs, ngModel) {

        //listen for changes so that can propagate container type
        scope.$watch('containerSelectCtrl.model.container', scope.containerSelectCtrl.handleChange);

        //listen for changes to parameter, update container type
        scope.$on('editor:parameterChange', scope.containerSelectCtrl.handleChange);

        scope.createNewContainer = function (newCont) {
          var param = ProtocolUtils.createContainer({
            value: {
              type: newCont.shortname
            }
          });
          scope.selectContainerParam(param);
        };

        scope.selectContainerParam = function (param) {
          ngModel.$setViewValue({container: _.result(param, 'id')});
        };

        scope.containerColorFromId = ProtocolUtils.containerColorFromId;

        scope.containerNameFromId = ProtocolUtils.paramNameFromParamId;

      }
    };
  });
