'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Protocol
 * @description
 * initial work for a javascript like autoprotocol generator
 * note that this is a UI focused project (so far) so this is kinda secondary.
 */
angular.module('transcripticApp')
  .factory('ProtocolFactory', function () {

    function Protocol () {
      this.refs = {};
      this.instructions = [];
    }

    Protocol.prototype.addInstruction = function (inst) {
      this.instructions.push(inst);
    };

    Protocol.prototype.ref = function (name, params) {
      this.refs[name] = params;
    };

    return Protocol;
  });
