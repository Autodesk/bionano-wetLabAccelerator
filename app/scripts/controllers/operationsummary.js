'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:OperationsummaryctrlCtrl
 * @description
 * # OperationsummaryctrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('operationSummaryCtrl', function ($scope, ProtocolHelper, Omniprotocol) {
    var self = this;

    self.protocol = ProtocolHelper.currentProtocol;

    //general helper functions

    self.getFieldValueByName = function (fieldName) {
      return Omniprotocol.utils.pluckFieldValueRaw(self.operation.fields, fieldName);
    };

    //functions for fields with type container

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

    //todo - will need have in controller, and use a resource to do this
    self.transcripticUrlRoot = 'http://secure.transcriptic.com/'

  });
