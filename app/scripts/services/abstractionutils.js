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

    self.wrapGroupsInProtocol = function (groupsInput) {
      var groups = _.isArray(groupsInput) ? groupsInput : [groupsInput];

      return {
        "name"      : "",
        "references": [],
        "inputs"    : {},
        "parameters": {},
        "metadata"  : {},
        "groups"    : groups
      }
    };
  });
