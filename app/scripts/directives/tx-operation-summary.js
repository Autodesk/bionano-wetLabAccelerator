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
 * @name wetLabAccelerator.directive:txOperationSummary
 * @description
 * # txOperationSummary
 */
angular.module('wetLabAccelerator')
  .directive('txOperationSummary', function ($http, $compile, Omniprotocol, ProtocolHelper) {

    var templateMap = {
      'transfer'   : 'pipette',
      'consolidate': 'pipette',
      'distribute' : 'pipette',

      'mix'      : 'mix',
      'provision': 'provision',
      'dispense' : 'dispense',

      'spread'  : 'pipette',
      'autopick': 'pipette',

      'absorbance'  : 'spectrophotometry',
      'fluorescence': 'spectrophotometry',
      'luminescence': 'spectrophotometry',

      'incubate': 'container',
      'seal'    : 'container',
      'unseal'  : 'container',
      'cover'   : 'container',
      'uncover' : 'container',
      'spin'    : 'container',

      'image_plate' : 'attachment_plate',
      'gel_separate': 'attachment'
    };

    return {
      restrict        : 'E',
      scope           : {
        indices  : '=', //object with keys group, step, loop, unfolded
        operation: '=',
        runData  : '='
        //attr auto-scroll
      },
      bindToController: true,
      controllerAs    : 'summaryCtrl',
      controller      : 'operationSummaryCtrl',
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
              //element.html('<div class="alert alert-warning">template not found</div>')
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