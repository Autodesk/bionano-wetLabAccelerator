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
      angular.extend(toModify.config, {
        initiated: true,
        processing: true
      });

      funcToRun({project : self.project.url}, constructOrderPayload()).$promise.
        then(function runSuccess (d) {
          angular.extend(toModify.config, {
            processing: false,
            error: false
          });
          angular.extend(toModify.response, d);
          console.log(d);
        }, function runFailure (e) {
          angular.extend(toModify.config, {
            processing: false,
            error: true
          });
          //use as simple check for something like a 404 error - i.e. not protocol error but $http error
          if (angular.isUndefined(e.data.protocol)) {
            angular.extend(toModify.response, {"error" : "Request did not go through... check the console"})
          } else {
            angular.extend(toModify.response, e.data.protocol);
          }
          console.log(e);
        });
    }

    $scope.priceResponse = {
      config: {
        type: "Run",
        textProcessing: "Processing Pricing...",
        textSuccess: "Pricing Successful",
        textError: "There was an error in getting a price"
      },
      response: {}
    };
    this.priceOrder = angular.bind(self, resourceWrap, Order.price, $scope.priceResponse);

  });
