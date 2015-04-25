'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.DragDropManager
 * @description
 * # DragDropManager
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('DragDropManager', function (Omniprotocol) {
    this.type = {};
    this.model = {};

    this.groupFromOp = function (op) {
      var opKey = op.operation,
          opInfo = Omniprotocol.operations[opKey];

      return  _.extend(Omniprotocol.utils.wrapOpInGroup(op), {
        name : opInfo.name,
        metadata : {
          description: opInfo.description
        }
      });
    };

    this.getNeighborTops = function getNeighborTops (selector, fromParent) {
      var neighbors = fromParent.find(selector);
      return _.map(neighbors, function (neighbor) {
        return $(neighbor).offset().top;
      });
    };

    return this;
  });
