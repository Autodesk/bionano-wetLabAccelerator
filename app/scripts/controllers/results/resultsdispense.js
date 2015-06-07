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

    self.getGroupDataFromColVols = function (fieldName, containerFieldName) {
      //need to prune wells to container size
      var contType      = $scope.summaryCtrl.getContainerTypeFromFieldName(containerFieldName),
          contObj       = _.result(ContainerOptions, contType),
          wellsInColumn = _.result(contObj, 'col_count', 24),
          colvols       = Omniprotocol.utils.pluckFieldValueRaw($scope.summaryCtrl.operation.fields, fieldName);

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
