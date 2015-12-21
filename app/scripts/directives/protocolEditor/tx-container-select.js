/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txContainerSelect
 * @description
 * # txContainerSelect
 */
angular.module('wetLabAccelerator')
  .directive('txContainerSelect', function ($rootScope, $timeout, ContainerHelper, ProtocolHelper, ProtocolUtils, UUIDGen) {
    return {
      templateUrl     : 'views/tx-container-select.html',
      restrict        : 'E',
      require         : 'ngModel',
      scope           : {
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
          var relevantParam = ProtocolUtils.paramById(_.result(self.model, 'container'));
          if (relevantParam) {
            //expose type outside directive
            self.type = _.result(relevantParam, 'value.type');
          } else {
            self.type = '';
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
