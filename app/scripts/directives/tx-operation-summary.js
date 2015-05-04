'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperationSummary
 * @description
 * # txOperationSummary
 */
angular.module('transcripticApp')
  .directive('txOperationSummary', function ($http, $compile, Omniprotocol) {
    return {
      restrict        : 'E',
      scope           : {
        protocol     : '=',
        indices      : '=', //object with keys group, step, loop, unfolded
        operation    : '=',
        runData      : '='
        //attr auto-scroll
      },
      bindToController: true,
      controllerAs    : 'summaryCtrl',
      controller      : function protocolMiniController ($scope, $element, $attrs) {
        var self = this;

        self.getFieldValueByName = function (fieldName) {
          return Omniprotocol.utils.pluckFieldValueRaw(self.operation.fields, fieldName);
        };

        self.getContainerTypeFromFieldName = function (fieldName) {
          var containerName = self.getFieldValueByName(fieldName);
          return Omniprotocol.utils.getContainerTypeFromName(self.protocol.parameters, containerName);
        };

      },
      link            : function (scope, element, attrs) {

        scope.$watch('summaryCtrl.operation', getOperationTemplate);

        //todo - need to destroy previous template + scope when get new one

        function getOperationTemplate (operation) {
          _.has(operation, 'operation') &&
          $http.get('views/datavis/' + operation.operation + '.html', {cache: true}).
            success(function (data) {
              var $el = angular.element(data);
              element.html($compile($el)(scope));
            }).
            error(function () {
              element.html('<div class="alert alert-warning">template not found</div>')
            });
        }

        /*scope.$watchGroup([
            'summaryCtrl.protocol',
            'summaryCtrl.indices'],
          handleInputChange);

        function handleInputChange () {
          var indices  = scope.summaryCtrl.indices,
              protocol = scope.summaryCtrl.protocol;

          if (_.isEmpty(protocol) || _.isEmpty(indices)) {
            element.html('');
            return;
          }

          var groupNum = _.result(indices, 'group', 0),
              stepNum  = _.result(indices, 'step', 0);

          scope.operation = protocol.groups[groupNum].steps[stepNum];

          getOperationTemplate(scope.operation);
        }
        }
        };
        });
        */
      }
    }
  });