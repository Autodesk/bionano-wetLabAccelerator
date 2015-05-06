'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:ResultsdispensectrlCtrl
 * @description
 * # ResultsdispensectrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('resultsDispenseCtrl', function ($scope, ContainerOptions, WellConv, Omniprotocol) {
    var self = this;

    self.getContainerTypeFromContainerField = function (fieldName) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw($scope.summaryCtrl.operation.fields, fieldName);
      return Omniprotocol.utils.getContainerTypeFromName($scope.summaryCtrl.protocol.parameters, fieldVal);
    };

    self.getWellsFromColVols = function (fieldName, containerFieldName) {
      //need to prune wells to container size
      var contType      = self.getContainerTypeFromContainerField(containerFieldName),
          contObj       = _.result(ContainerOptions, contType),
          wellsInColumn = _.result(contObj, 'col_count', 24),
          colvols       = Omniprotocol.utils.pluckFieldValueRaw($scope.summaryCtrl.operation.fields, fieldName);

      return _.map(colvols, function (colvol) {
        return {
          name : self.readableVolume(colvol.volume),
          color: '#' + Math.floor(Math.random() * 16777215).toString(16), //todo - use plate color
          wells: _.flatten(_.map(colvol.columns, function (column) {
            return getWellsFromColumn(column, wellsInColumn);
          }))
        };
      });
    };

    self.getFieldValFromName = function (fieldName) {
      return Omniprotocol.utils.pluckFieldValueRaw($scope.summaryCtrl.operation.fields, fieldName);
    };

    self.readableVolume = function (volDim) {
      return volDim.value + ' ' + volDim.unit + 's';
    };

    function getWellsFromColumn (columnNumber, wellsInColumn) {
      var letters = WellConv.letters;
      return _.map(_.range(wellsInColumn), function (wellnum) {
        return letters[wellnum] + (columnNumber);
      });
    }

  });
