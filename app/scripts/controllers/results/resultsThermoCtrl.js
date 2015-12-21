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
 * @ngdoc function
 * @name wetLabAccelerator.controller:OperationsummaryctrlCtrl
 * @description
 * # OperationsummaryctrlCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('resultsThermoCtrl', function ($scope, DataConv, ProtocolHelper, RunHelper, Omniprotocol) {
    var self = this;

    //todo
    self.onInit = function () {

      if ($scope.summaryCtrl.runData) {

        self.opName = $scope.summaryCtrl.operation.operation;

        self.rundataFiltered = _.pick($scope.summaryCtrl.runData, function (dataref) {
          return _.result(dataref, 'instruction.operation.op') == self.opName;
        });

        self.opData = DataConv.parseThermocycle(self.rundataFiltered, true);

        self.dyes = _.keys(self.opData);
        self.selectDye(self.containers[0]);
      }
    };

    self.selectDye = function (dye) {

    };

  });