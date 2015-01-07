'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('MainCtrl', function ($scope, Container, Run, RefFactory) {

    //this.containers = Container.list();

    //this.runs = Run.list({project: "p17a7q9dd7zcy"});

    $scope.myDimension = "";

    $scope.myRefs = {
      "cells": new RefFactory({
        "id": "ct17ab4pbtpjmh",
        "store": { "where": "cold_20" }
      }),
      "pcr": new RefFactory({
        "new": "96-pcr",
        "store": { "where": "ambient" }
      }),
      "primer": new RefFactory({
        "id": "ct17ab4ppqsrmv",
        "discard": true
      })
    };
  });
