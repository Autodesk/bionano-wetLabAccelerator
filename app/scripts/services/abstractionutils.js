'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.AbstractionUtils
 * @description
 * # AbstractionUtils
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('AbstractionUtils', function (ConversionUtils) {
    var self = this;

    /*******
     Wells
     ******/

    self.flattenAliquots = function (abstAliquots) {
      return _.map(abstAliquots, function (aliquot) {
        return ConversionUtils.joinContainerWell(aliquot.container, aliquot.well);
      });
    };

    /*******
     Wrapping
     ******/

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
