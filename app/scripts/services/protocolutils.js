'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.ProtocolUtils
 * @description
 * # ProtocolUtils
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('ProtocolUtils', function ($rootScope, ProtocolHelper, ContainerHelper, UUIDGen, Omniprotocol) {

    var self = this;

    self.protocol = ProtocolHelper.currentProtocol;

    //parameter helpers

    //todo - better guarantee unique
    function monotonicName (type) {
      return '' + type + (_.filter(self.protocol.parameters, {type: type}).length + 1);
    }

    self.paramById = _.partial(Omniprotocol.utils.parameterById, self.protocol);

    self.paramValueFromParamId = _.partial(Omniprotocol.utils.parameterValueById, self.protocol);

    self.paramNameFromParamId = _.partial(Omniprotocol.utils.parameterNameById, self.protocol);


    //parameter manipulation

    //note that setupCtrl has a running check on the parameters to check e.g. for container changes and update the ContainerHelper. could maybe move that here if everything goes through this...

    //either pass type as string, or must include field 'type'
    //might make sense to eventually move this to utils, but need naming + UUIDGen
    self.createParameter = function (param) {
      var paramType = _.isString(param) ? param : _.result(param, 'type'),
          parameter = _.assign({
            id  : UUIDGen(),
            name: monotonicName(paramType),
            type: paramType
          }, (_.isString(param) ? {} : param));

      self.protocol.parameters.push(parameter);

      $rootScope.$broadcast('editor:toggleSetupVisibility', true);

      return parameter;
    };

    //must pass object
    self.createContainer = function (param) {
      return self.createParameter(_.merge({
        value: {
          isNew: true,
          color: ContainerHelper.randomColor()
        }
      }, param, {type: 'container'}));
    };

    //expects a parameter object
    self.deleteParameter = function (param) {
      Omniprotocol.utils.safelyDeleteParameter(self.protocol, param);
    };

    self.clearParameterValue = function (param) {
      delete param.value;
    };

    //field helpers

    //workhorse - given op and fieldname, get field value, checking for parameter
    self.getFieldValue = function (op, fieldName) {
      var field     = Omniprotocol.utils.pluckField(op.fields, fieldName),
          parameter = _.result(field, 'parameter');

      return !!parameter ? self.paramValueFromParamId(parameter) : _.result(field, 'value');
    };

    //NOT RECOMMENDED! should by tied by ID
    self.paramByName = function (name) {
      return _.find(self.protocol.parameters, {name: name});
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

    //functions for fields with type container

    self.getContainerIdFromFieldName = function (op, fieldName) {
      var containerObj = self.getFieldValue(op, fieldName);
      return _.result(containerObj, 'container');
    };

    self.getContainerValueFromFieldName = function (op, fieldName) {
      var containerId = self.getContainerIdFromFieldName(op, fieldName);
      return self.paramValueFromParamId(containerId);
    };

    self.getContainerNameFromFieldName = function (op, fieldName) {
      var containerId = self.getContainerIdFromFieldName(op, fieldName);
      return self.paramNameFromParamId(containerId);
    };

    self.getContainerTypeFromFieldName = function (op, fieldName) {
      return _.result(self.getContainerValueFromFieldName(op, fieldName), 'type');
    };

    self.getContainerColorFromFieldName = function (op, fieldName) {
      return _.result(self.getContainerValueFromFieldName(op, fieldName), 'color');
    };

    //wells - pipette operations

    //given an aliquot/aliquot+ fieldName, get the wells, and can pass container to filter to one container
    self.pluckWellsFromAliquots = function (op, fieldName, container) {
      var fieldVal       = self.getFieldValue(op, fieldName);

      // when support aliquot++, and know format, allow filtering by container
      // var filterFunction = _.isUndefined(container) ? _.constant(true) : _.matches({container: container});

      return _.result(fieldVal, 'wells');
    };

    //future, need to handle aliquot++... but this handles aliquot and aliquot+
    self.containerIdFromAliquot = function (op, fieldName) {
      var fieldVal = self.getFieldValue(op, fieldName);
      return _.result(fieldVal, 'container');
    };

    //supoprt for container is pending aliquot++
    self.getContainerTypeFromAliquots = function (op, fieldName, container) {
      var containerId = self.containerIdFromAliquot(op, fieldName, container);
      return self.containerTypeFromId(containerId);
    };

    //supoprt for container is pending aliquot++
    self.getContainerColorFromAliquots = function (op, fieldName, container) {
      var containerId = self.containerIdFromAliquot(op, fieldName, container);
      return self.containerColorFromId(containerId);
    };

    //unclear how to handle container for aliquot++
    self.getContainerNameFromAliquots = function (op, fieldName, container) {
      var containerId = self.containerIdFromAliquot(op, fieldName, container);
      return self.paramNameFromParamId(containerId);
    };

    //utils

    self.readableDimensional = function (dimObj) {
      if (_.isUndefined(dimObj)) {
        return 'unspecified amount';
      }
      return _.result(dimObj, 'value') + ' ' + _.result(dimObj, 'unit') + 's';
    };

  });
