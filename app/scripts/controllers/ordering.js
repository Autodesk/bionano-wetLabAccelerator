'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:OrderingCtrl
 * @description
 * # OrderingCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('OrderingCtrl', function ($scope, Project, OrderingOptions, Order) {

    var self = this;

    self.projects = Project.list();
    self.orderingOptions = Object.keys(OrderingOptions);

    function constructOrderPayload () {
      return {
        title: self.orderTitle,
        request: self.order
      }
    }

    //todo - merge with main controller
    function resourceWrap (funcToRun, toModify) {
      angular.copy({
        initiated: true,
        processing: true
      }, toModify);

      funcToRun({project : self.project.url}, constructOrderPayload()).$promise.
        then(function runSuccess (d) {
          angular.extend(toModify, {
            processing: false,
            error: false,
            response: d
          });
          console.log(d);
        }, function runFailure (e) {
          angular.extend(toModify, {
            processing: false,
            error: true,
            response: e.data.protocol
          });
          console.log(e);
        });
    }

    $scope.priceResponse = {};
    this.priceOrder = angular.bind(self, resourceWrap, Order.price, $scope.priceResponse);

  });
