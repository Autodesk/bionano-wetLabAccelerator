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

    //thermocycleMelting
    this.field =
    {
      name : 'melting',
      type : 'thermocycleMelting',
      value: {
        "start"    : {"value": 60, "unit": "celsius"},
        "end"      : {"value": 80, "unit": "celsius"},
        "increment": {"value": 5, "unit": "celsius"},
        "rate"     : {"value": 5, "unit": "minute"}
      }
    };

    /*
    //columnVolumes
    this.field = {
      "name"           : "columns",
      "type"           : "columnVolumes",
      "singleContainer": true,
      "value"          : [
        {
          "columns": [
            "0",
            "1",
            "8"
          ],
          "color" : "#ff99ff",
          "volume" : {
            "unit" : "microliter",
            "value": 50
          }
        },
        {
          "columns": [
            "2",
            "9",
            "5"
          ],
          "color" : "#99ff99",
          "volume" : {
            "unit" : "nanoliter",
            "value": 90
          }
        }
      ]
    }
    */
  });
