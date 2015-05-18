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

    //wells - pipette (mostly)

    self.pluckWellsFromContainer = function (fieldName, container) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw(self.operation.fields, fieldName),
          filterFunction = _.isUndefined(container) ? _.constant(true) : _.matches({container: container});
      return _.pluck(_.filter(fieldVal, filterFunction), 'well');
    };

    self.getContainerFromWellField = function (fieldName) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw(self.operation.fields, fieldName);
      return _.result(fieldVal, '[0].container');
    };

    self.getContainerTypeFromWellField = function (fieldName) {
      var containerName = self.getContainerFromWellField(fieldName);
      return Omniprotocol.utils.getContainerTypeFromName(self.protocol.parameters, containerName);
    };
    
    self.getContainerColorFromWellField = function (fieldName) {
      var containerName = self.getContainerFromWellField(fieldName);
      return self.getContainerColorFromContainerName(containerName);
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
