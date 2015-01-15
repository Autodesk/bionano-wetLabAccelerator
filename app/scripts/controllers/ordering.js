'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:OrderingCtrl
 * @description
 * # OrderingCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('OrderingCtrl', function ($scope, Project, OrderingOptions) {

    var self = this;

    self.projects = Project.list();

    self.orderingOptions = Object.keys(OrderingOptions);

    self.order = {"blah" : "yada"};

  });
