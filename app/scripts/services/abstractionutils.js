'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AbstractionUtils
 * @description
 * # AbstractionUtils
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('AbstractionUtils', function () {
    var self = this;

    self.wrapOpInGroup = function (op) {
      return {
        name    : "",
        inputs  : {},
        metadata: {},
        loop    : 1,
        steps   : [
          op
        ]
      }
    };
  });
