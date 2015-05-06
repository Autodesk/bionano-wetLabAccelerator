'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txOperationSummary
 * @description
 * # txOperationSummary
 */
angular.module('transcripticApp')
  .directive('txOperationSummary', function ($http, $compile, Omniprotocol) {

    var templateMap = {
      'transfer'   : 'pipette',
      'consolidate': 'pipette',
      'distribute' : 'pipette',

      'mix': 'mix',

      'dispense': 'dispense',

      'absorbance'  : 'spectrophotometry',
      'fluorescence': 'spectrophotometry',
      'luminescence': 'spectrophotometry',

      'incubate': 'container',
      'seal'    : 'container',
      'unseal'  : 'container',
      'cover'   : 'container',
      'uncover' : 'container'
    };

    return {
      restrict        : 'E',
      scope           : {
        protocol : '=',
        indices  : '=', //object with keys group, step, loop, unfolded
        operation: '=',
        runData  : '='
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

        self.getContainerColorFromContainerName = function (containerName) {
          var cont = Omniprotocol.utils.getContainerFromName(self.protocol.parameters, containerName);
          return _.result(cont, 'value.color');
        };

        self.getContainerColorFromFieldName = function (fieldName) {
          var containerName = self.getFieldValueByName(fieldName);
          return self.getContainerColorFromContainerName(containerName);
        };

      },
      link            : function (scope, element, attrs) {

        scope.$watch('summaryCtrl.operation', getOperationTemplate);

        //todo - need to destroy previous template + scope when get new one

        function getOperationTemplate (operation) {
          var opName       = _.result(operation, 'operation'),
              templateName = _.result(templateMap, opName, opName);

          $http.get('views/datavis/' + templateName + '.html', {cache: true}).
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