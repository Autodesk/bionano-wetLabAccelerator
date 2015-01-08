'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Protocol
 * @description
 * initial work for a javascript like autoprotocol generator
 * note that this is a UI focused project (so far) so this is kinda secondary.
 */
angular.module('transcripticApp')
  .factory('ProtocolFactory', function (RefFactory) {

    function Protocol (input) {
      angular.extend(this, {
        refs: {},
        instructions: []
      }, input);

      angular.forEach(this.refs, function (ref, key) {
        this.refs[key] = new RefFactory(ref);
      }.bind(this));
    }

    Protocol.prototype.addInstruction = function (inst) {
      this.instructions.push(inst);
    };

    Protocol.prototype.ref = function (name, params) {
      this.refs[name] = new RefFactory(params);
    };

    return Protocol;
  });
