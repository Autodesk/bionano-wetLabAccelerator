'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('MainCtrl', function ($scope, $http, ProtocolFactory, Run, Project) {

    var self = this;

    $http.get('demo_protocols/pcr-example.json').success(function(data) {
      this.exampleProtocol = new ProtocolFactory(data);
    }.bind(this));

    function constuctPayload () {
      return {
        title: self.runTitle,
        protocol: self.exampleProtocol
      }
    }

    this.submit = function () {
      Run.submit({project : self.project}, constuctPayload()).$promise.
      then(function (d) {
        console.log(d);
        $scope.error = false;
        $scope.response = d;
      }, function (e) {
        $scope.error = true;
        $scope.response = e.data.protocol;
      });
    };

    this.analyze = function () {
      Run.analyze({project : self.project}, constuctPayload()).$promise.
      then(function (d) {
        console.log(d);
        $scope.error = false;
        $scope.response = d;
      }, function (e) {
        $scope.error = true;
        $scope.response = e.data.protocol;
      });
    };

    this.projects = Project.list();
  });
