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

    //parameter helpers

    self.paramById = _.partial(Omniprotocol.utils.parameterById, self.protocol);

    self.paramValueFromParamId = _.partial(Omniprotocol.utils.parameterValueById, self.protocol);

    self.paramNameFromParamId = _.partial(Omniprotocol.utils.parameterNameById, self.protocol);

    //expects a parameter object
    self.deleteParameter = _.partial(Omniprotocol.utils.safelyDeleteParameter, self.protocol);

    //field helpers

    //workhorse - given op and fieldname, get field value, checking for parameter
    self.getFieldValue = function (op, fieldName) {
      var field = Omniprotocol.utils.pluckField(op.fields, fieldName),
          parameter = _.result(field, 'parameter');

      return !!parameter ? self.paramValueFromParamId(parameter) : _.result(field, 'value');
    };

    //NOT RECOMMENDED! should by tied by ID
    self.paramByName = function (name) {
      return _.find(self.protocol.parameters, {name : name});
    };

    //container helpers

    self.containerFromId = function (id) {
      return _.result(self.paramById(id), 'value');
    };

    self.containerColorFromId = function (id) {
      return _.result(self.containerFromId(id), 'color');
    };

    self.containerTypeFromId = function (id) {
      return _.result(self.containerFromId(id), 'type');
    };






    self.getFieldValFromOpByName = self.getFieldValue;


    //wells - pipette operations

    //todo - refactor to new format
    //given an aliquot+ fieldName, get the wells, and can pass container to filter to one container
    self.pluckWellsFromAliquots = function (op, fieldName, container) {
      var fieldVal = self.getFieldValue(op.fields, fieldName),
          filterFunction = _.isUndefined(container) ? _.constant(true) : _.matches({container: container});
      return _.pluck(_.filter(fieldVal, filterFunction), 'well');
    };

    //future, need to handle aliquot++... but this handles aliquot and aliquot+
    self.containerFromAliquot = function (op, fieldName) {
      var fieldVal = self.getFieldValue(op.fields, fieldName);
      return _.result(fieldVal, 'container');
    };

    //todo - refactor for new format
    //todo - handle having id, not name
    self.getFirstContainerFromAliquots = function (op, fieldName) {
      var fieldVal = self.getFieldValue(op.fields, fieldName);
      return _.result(fieldVal, '[0].container');
    };

    self.getContainerTypeFromAliquots = function (op, fieldName) {
      var containerName = self.getFirstContainerFromAliquots(op, fieldName);
      //todo - use id
      return Omniprotocol.utils.getContainerTypeFromName(self.protocol.parameters, containerName);
    };

    self.getContainerColorFromAliquots = function (op, fieldName) {
      var containerName = self.getFirstContainerFromAliquots(op, fieldName);
      //todo - use id
      return self.getContainerColorFromContainerName(containerName);
    };

    //functions for fields with type container

    //todo - use id
    self.getContainerTypeFromFieldName = function (op, fieldName) {
      var containerName = self.getFieldValFromOpByName(op, fieldName);
      return Omniprotocol.utils.getContainerTypeFromName(self.protocol.parameters, containerName);
    };

    //todo - use id
    self.getContainerColorFromFieldName = function (op, fieldName) {
      var containerName = self.getFieldValFromOpByName(op, fieldName);
      return self.getContainerColorFromContainerName(containerName);
    };

    //todo - deprecate
    self.getContainerColorFromContainerName = function (containerName) {
      var cont = Omniprotocol.utils.getContainerFromName(self.protocol.parameters, containerName);
      return _.result(cont, 'value.color');
    };

    //utils

    self.readableDimensional = function (dimObj) {
      if (_.isUndefined(dimObj)) {
        return 'unspecified amount';
      }
      return _.result(dimObj, 'value') + ' ' + _.result(dimObj, 'unit') + 's';
    };

  });
