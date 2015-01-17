'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:PipetteCtrl
 * @description
 * # PipetteCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('PipetteCtrl', function ($scope) {

    function constructPITemplateUrl (key) {
      return  'views/instructions/pipette/' + key + '.html';
    }

    function constructEmptyPI (type) {
      //comeon ES6 we need you
      var x = {};
      x[type] = {};
      return x
    }

    //note assumes there is only one key for each group - the liquid handling step
    this.groupKey = function (group) {
      return Object.keys(group)[0];
    };

    this.groupUrl = function (group) {
      return constructPITemplateUrl(this.groupKey(group));
    };

    this.sortableOptions = {
      axis: 'y',
      scroll: true,
      handle: '.drag-handle'
    };

    this.pipetteInstructions = ["transfer", "distribute", "consolidate", "mix"];

    this.addPipetteInstruction = function (type) {
      //need to check if groups is defined, because if they dropped it in, it won't be
      //todo - refactor to scaffolds for each step in InstructionOptions
      if (angular.isUndefined($scope.instruction.groups)) {
        $scope.instruction.groups = []
      }

      $scope.instruction.groups.push(constructEmptyPI(type));
    };

    this.removePI = function (index) {
      $scope.instruction.groups.splice(index, 1);
    };


    this.duplicatePI = function (index) {
      $scope.instruction.groups.splice(index, 0, angular.copy($scope.instruction.groups[index]));
    };
  });
