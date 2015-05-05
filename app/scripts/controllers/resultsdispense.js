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
      var fieldVal      = Omniprotocol.utils.pluckFieldValueRaw($scope.summaryCtrl.operation.fields, fieldName),
          containerName = _.result(fieldVal, 'name');
      return Omniprotocol.utils.getContainerTypeFromName($scope.summaryCtrl.protocol.parameters, containerName);
    };

    self.getContainerObjFromContainerType = function (shortname) {
      return _.result(ContainerOptions, shortname);
    };


    //todo - refactor dispense operation, use here appropriately
    self.getWellsFromColVols = function (fieldName, containerFieldName) {
      //need to prune wells to container size
      var contType = self.getContainerTypeFromContainerField(containerFieldName),
          contObj  = self.getContainerObjFromContainerType(contType),
          colVolField = Omniprotocol.utils.pluckFieldValueRaw($scope.summaryCtrl.operation.fields, fieldName),
          columns  = _.pluck(colVolField, 'column'),
          volumes  = _.pluck(colVolField, 'volume'),
          //todo - pending refactor
          colMap = _.map(columns, function (colnum) {
            var alpha = WellConv.letters[colnum];
          });
    };

  });
