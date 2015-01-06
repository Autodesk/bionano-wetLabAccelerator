'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('MainCtrl', function ($scope, Container, Run) {

    this.containers = Container.list();

    this.runs = Run.list({project: "p17a7q9dd7zcy"});

    this.submitDemo = function () {
      Run.submit({project: "p17a7q9dd7zcy"}, {
        "title": "Incubate bacteria",
        "protocol": {
          "refs": {
            "plate1": {
              "id": "ct17aabqfrmy4y",
              "store": { "where": "cold_4" }
            }
          },
          "instructions": [
            {
              "op": "incubate",
              "object": "plate1",
              "where": "warm_37",
              "duration": "2:hour",
              "shaking": true
            }
          ]
        }
      });
    };

  });
