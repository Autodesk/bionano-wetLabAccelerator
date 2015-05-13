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

    var self = this;

    this.groupFromOp = function (op) {
      return _.extend(Omniprotocol.utils.wrapOpInGroup(op), {
        name    : '',
        metadata: {
          description: ''
        }
      });
    };

    this.getNeighborTops = function getNeighborTops (selector, fromParent) {
      var neighbors = fromParent.find(selector);
      return _.map(neighbors, function (neighbor) {
        return $(neighbor).offset().top;
      });
    };

    this.groupFromModel = function () {
      return self.type == 'operation' ?
        self.groupFromOp(self.model) :
        self.model;
    };

    this.stepsFromModel = function () {
      return self.type == 'operation' ?
        [self.model] :
        self.model.steps;
    };

    this.clear = function () {
      self.type   = {};
      self.model  = {};
      self.onDrop = _.noop;
    };

    //init
    this.clear();

    return this;
  });
