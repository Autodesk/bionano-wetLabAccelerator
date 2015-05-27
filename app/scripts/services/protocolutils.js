'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ProtocolUtils
 * @description
 * # ProtocolUtils
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ProtocolUtils', function (ProtocolHelper, Omniprotocol) {

    var self = this;

    self.protocol = ProtocolHelper.currentProtocol;

    self.getFieldValFromOpByName = function (op, fieldName) {
      return Omniprotocol.utils.pluckFieldValueRaw(op.fields, fieldName);
    };

    self.readableDimensional = function (dimObj) {
      if (_.isUndefined(dimObj)) {
        return 'unspecified amount';
      }
      return _.result(dimObj, 'value') + ' ' + _.result(dimObj, 'unit') + 's';
    };

    self.paramById = function (id) {
      return _.find(self.protocol.parameters, {id : id});
    };

    //NOT RECOMMENDED! should by tied by ID
    self.paramByName = function (name) {
      return _.find(self.protocol.parameters, {name : name});
    };


    //wells - pipette operations

    //given an aliquot+ fieldName, get the wells, and can pass container to filter to one container
    self.pluckWellsFromAliquots = function (op, fieldName, container) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw(op.fields, fieldName),
          filterFunction = _.isUndefined(container) ? _.constant(true) : _.matches({container: container});
      return _.pluck(_.filter(fieldVal, filterFunction), 'well');
    };

    self.getFirstContainerFromAliquots = function (op, fieldName) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw(op.fields, fieldName);
      return _.result(fieldVal, '[0].container');
    };

    self.getContainerTypeFromAliquots = function (op, fieldName) {
      var containerName = self.getFirstContainerFromAliquots(op, fieldName);
      return Omniprotocol.utils.getContainerTypeFromName(self.protocol.parameters, containerName);
    };

    self.getContainerColorFromAliquots = function (op, fieldName) {
      var containerName = self.getFirstContainerFromAliquots(op, fieldName);
      return self.getContainerColorFromContainerName(containerName);
    };

    //functions for fields with type container

    self.getContainerTypeFromFieldName = function (op, fieldName) {
      var containerName = self.getFieldValFromOpByName(op, fieldName);
      return Omniprotocol.utils.getContainerTypeFromName(self.protocol.parameters, containerName);
    };

    self.getContainerColorFromFieldName = function (op, fieldName) {
      var containerName = self.getFieldValFromOpByName(op, fieldName);
      return self.getContainerColorFromContainerName(containerName);
    };

    self.getContainerColorFromContainerName = function (containerName) {
      var cont = Omniprotocol.utils.getContainerFromName(self.protocol.parameters, containerName);
      return _.result(cont, 'value.color');
    };

  });
