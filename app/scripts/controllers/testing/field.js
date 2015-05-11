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

    //thermocycleGroup
    this.field = {
      "name": "group",
      "type": "thermocycleGroups",
      "value": [
        {
          "type" : "thermocycleGroup",
          "value": {
            "steps" : [
              {
                "duration"   : {
                  "unit" : "minute",
                  "value": 5
                },
                "temperature": {
                  "unit" : "celsius",
                  "value": 50
                }
              }
            ],
            "cycles": 1
          }
        },
        {
          "type" : "thermocycleGroup",
          "value": {
            "steps" : [
              {
                "duration"   : {
                  "unit" : "second",
                  "value": 30
                },
                "temperature": {
                  "unit" : "celsius",
                  "value": 40
                }
              },
              {
                "duration"   : {
                  "unit" : "minute",
                  "value": 2
                },
                "temperature": {
                  "unit" : "celsius",
                  "value": 95
                }
              },
              {
                "duration"   : {
                  "unit" : "minute",
                  "value": 1
                },
                "temperature": {
                  "unit" : "celsius",
                  "value": 60
                }
              }
            ],
            "cycles": 30
          }
        }
      ]
    };

    /*
    //thermocycleMelting
    this.field = {
      name : 'melting',
      type : 'thermocycleMelting',
      value: {
        "start"    : {"value": 60, "unit": "celsius"},
        "end"      : {"value": 80, "unit": "celsius"},
        "increment": {"value": 5, "unit": "celsius"},
        "rate"     : {"value": 5, "unit": "minute"}
      }
    };
    */

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
