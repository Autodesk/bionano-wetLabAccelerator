'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:OperationsummaryctrlCtrl
 * @description
 * # OperationsummaryctrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
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