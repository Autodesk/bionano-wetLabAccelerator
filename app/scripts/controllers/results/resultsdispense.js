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
 * @name wetLabAccelerator.controller:ResultsdispensectrlCtrl
 * @description
 * # ResultsdispensectrlCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('resultsDispenseCtrl', function ($scope, ContainerOptions, WellConv, Omniprotocol, ProtocolUtils) {
    var self = this;

    self.getGroupDataFromColVols = function (fieldName, containerFieldName) {
      //need to prune wells to container size
      var contType      = $scope.summaryCtrl.getContainerTypeFromFieldName(containerFieldName),
          contObj       = _.result(ContainerOptions, contType),
          wellsInColumn = _.result(contObj, 'col_count', 24),
          colvols       = $scope.summaryCtrl.getFieldValueByName(fieldName);

      return _.map(colvols, function (colvol) {
        return {
          name : self.readableVolume(colvol.volume),
          color: $scope.summaryCtrl.getContainerColorFromFieldName('object'),
          wells: _.flatten(_.map(colvol.columns, function (column) {
            return getWellsFromColumn(column, wellsInColumn);
          }))
        };
      });
    };

    self.readableVolume = function (volDim) {
      return volDim.value + ' ' + volDim.unit + 's';
    };

    function getWellsFromColumn (columnNumber, wellsInColumn) {
      var letters = WellConv.letters;
      return _.map(_.range(wellsInColumn), function (wellnum) {
        //increment column number by one to match plate
        return letters[wellnum] + (_.parseInt(columnNumber, 10) + 1);
      });
    }

    self.parseInt = _.parseInt;

  });
