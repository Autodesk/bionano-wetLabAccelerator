'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.Protocol
 * @description
 * # Protocol
 * Factory in the transcripticApp.
 */
angular.module('transcripticApp')
  .factory('Protocol', function () {

    var self = this;

    this.refs = {};
    this.instructions = [];

    //todo - validation
    Object.defineProperties(this.prototype, {
      addRef: {
        value: function (name, params) {
          self.refs[name] = params;
        }
      },
      addInstruction: {
        value: function (instruction) {
          self.instructions.push(instruction);
        }
      }
    });

    return this;
  });
