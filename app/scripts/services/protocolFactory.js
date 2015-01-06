'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Protocol
 * @description
 * Local Factory for Protocols
 */
angular.module('transcripticApp')
  .factory('ProtocolFactory', function () {

    var self = this;

    this.refs = {};
    this.instructions = [];

    function addInstruction(inst) {
      //todo - validation
      self.instructions.push(inst);
    }

    Object.defineProperties(this.prototype, {
      ref: {
        value: function (name, params) {
          self.refs[name] = params;
        }
      }
    });

    return this;
  });
