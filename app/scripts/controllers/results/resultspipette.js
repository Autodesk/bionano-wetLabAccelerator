'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:ResultspipettectrlCtrl
 * @description
 * # ResultspipettectrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('resultsPipetteCtrl', function ($scope, Omniprotocol) {
    var self = this;

    self.pruneWellsFromContainer = function (fieldName, container) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw($scope.summaryCtrl.operation.fields, fieldName);
      return _.pluck(_.filter(fieldVal, _.matches({container: container})), 'well');
    };

    self.getContainerFromWellField = function (fieldName) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw($scope.summaryCtrl.operation.fields, fieldName),
      containerName = _.result(fieldVal, '[0].container');
      return Omniprotocol.utils.getContainerTypeFromName($scope.summaryCtrl.protocol.parameters, containerName);
    };

  });
