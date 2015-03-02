'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AutoprotocolInstruction
 * @description
 * # AutoprotocolInstruction
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('AutoprotocolInstruction', function (AutoprotocolType, ConversionUtils) {
   var self = this;

    function pluckField (fields, fieldName) {
      return _.find(fields, {name : fieldName});
    }

    function pluckFieldValue (fields, fieldName) {
      return _.result(pluckField(fields, fieldName), 'value');
    }

    self.cover = ConversionUtils.simpleMapOperation;
    self.uncover = ConversionUtils.simpleMapOperation;
    self.seal = ConversionUtils.simpleMapOperation;
    self.unseal = ConversionUtils.simpleMapOperation;

    self.fluorescence = ConversionUtils.simpleMapOperation;
    self.luminescence = ConversionUtils.simpleMapOperation;
    self.absorbance = ConversionUtils.simpleMapOperation;

    //todo - decide on data structure for container/well selections
    self.gel_separate = function (op, params) {

    };

    self.transfer = function (op, params) {

      var transfers = [];

      var fromWells = pluckFieldValue(op.fields, 'from_wells'),
          toWells = pluckFieldValue(op.fields, 'to_wells');

      if ( fromWells.length != toWells.length) {

        if (fromWells.length == 1) {
          _.fill(fromWells, fromWells[0], 0, toWells.length);
        } else {
          console.warn('transfer wells dont match up');
          return null;
        }
      }

      var volume = pluckFieldValue(op.fields, 'volume'),
          toContainer = pluckFieldValue(op.fields, 'to_container'),
          fromContainer = pluckFieldValue(op.fields, 'from_container'),
          mix_after = AutoprotocolType.mixwrap(pluckFieldValue(op.fields, 'mix_after'));

      //assuming that to_wells is always greater than from_wells
      _.forEach(toWells, function (toWell, index) {

        transfers.push({
          volume: volume,
          to: ConversionUtils.joinContainerWell(toWell, toContainer),
          from: ConversionUtils.joinContainerWell(fromWells[index], fromContainer),
          mix_after: mix_after
        });
      });

      return ConversionUtils.wrapInPipette({transfer : transfers});
    };
  });
