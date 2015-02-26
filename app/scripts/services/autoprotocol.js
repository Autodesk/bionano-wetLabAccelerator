'use strict';

/**
 * @ngdoc factory
 * @name transcripticApp.autoprotocol
 * @description
 * Service converting between abstraction and
 */
angular.module('transcripticApp')
  .service('Autoprotocol', function () {

    //convert abstraction to autoprotocol
    function fromAbstraction (abst) {
      //todo
      return {
        "autoprotocol" : "forthcoming!"
      };
    }

    //convert autoprotocol to abstraction
    function toAbstraction (auto) {

    }

    //basic check to see if json looks to be an abstraction
    function isAbstraction (json) {

    }

    return {
      fromAbstraction : fromAbstraction,
      toAbstraction : toAbstraction,
      isAbstraction : isAbstraction
    }
  });
