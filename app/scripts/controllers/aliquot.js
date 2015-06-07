'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:AliquotCtrl
 * @description
 * # AliquotCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('AliquotCtrl', function ($scope) {
    var self = this;

    self.handleAliquotSelection = function (wells, transpose) {



      self.field.transpose = transpose;
    };

    self.init = function () {
      //hack - assumes fieldCtrl
      if (!$scope.fieldCtrl) {
        return;
      }

      //setup field
      self.field = $scope.fieldCtrl.field;
      if (_.isUndefined(self.field.value)) {
        self.field.value = {};
      }

      //setup model
      self.model = self.field.value;



      self.aliquotMultiple = self.field.type != 'aliquot';
      self.singleContainer = self.field.type != 'aliquot++';

    };
  });
