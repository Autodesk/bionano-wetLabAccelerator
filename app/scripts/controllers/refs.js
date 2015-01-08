'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:RefsCtrl
 * @description
 * # RefsCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('RefsCtrl', function ($scope, Container, Run, RefFactory) {

    $scope.myDimension = "25:microliter";

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
