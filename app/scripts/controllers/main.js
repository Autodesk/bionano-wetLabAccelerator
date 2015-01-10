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

    self.protocols = ['aaron-growth', 'growth-curve-generic', 'pcr-example'];

    self.retrieve = function (protocol) {
      self.selectedProtocol = protocol;
      $http.get('demo_protocols/' + protocol + '.json').success(function(data) {
        self.exampleProtocol = new ProtocolFactory(data);
      });
    };

    self.retrieve(self.protocols[1]);

    function constructRunPayload () {
      return {
        title: self.runTitle,
        protocol: self.exampleProtocol
      }
    }

    this.submit = function () {
      Run.submit({project : self.project}, constructRunPayload()).$promise.
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
      Run.analyze({project : self.project}, constructRunPayload()).$promise.
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
