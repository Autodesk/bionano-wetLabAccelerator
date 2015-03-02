'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AutoprotocolType
 * @description
 * # AutoprotocolType
 * Service for conversion of field types
 */
angular.module('transcripticApp')
  .service('AutoprotocolType', function () {
    var self = this;

    //dummy for now
    self.mixwrap = function (mixwrap) {
      return mixwrap;
    };
  });
