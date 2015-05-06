'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:TestingFieldCtrl
 * @description
 * # TestingFieldCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('TestingFieldCtrl', function () {
    this.field = {
      "name": "columns",
        "type": "columnVolumes",
        "singleContainer": true,
        "value": [
        {
          "columns": [
            "0",
            "1",
            "3"
          ],
          "volume": {
            "unit": "microliter",
            "value": 50
          }
        },
        {
          "columns": [
            "2",
            "4",
            "5"
          ],
          "volume": {
            "unit": "nanoliter",
            "value": 90
          }
        }
      ]
    }
  });
