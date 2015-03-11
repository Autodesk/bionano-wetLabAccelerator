'use strict';
//todo - migrate to service InputTypes
/**
 * @ngdoc service
 * @name transcripticApp.AutoprotocolType
 * @description
 * # AutoprotocolType
 * Service for conversion of field types
 */
angular.module('transcripticApp')
  .service('ConvAutoprotocolType', function () {
    var self = this;

    //dummy for now
    self.mixwrap = function (mixwrap) {
      return mixwrap;
    };
  });
