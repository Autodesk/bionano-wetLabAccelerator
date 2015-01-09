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

    $http.get('demo_protocols/aaron-growth.json').success(function(data) {
      this.exampleProtocol = new ProtocolFactory(data);
    }.bind(this));

    this.submit = function (projectId) {
      if (!angular.isString(projectId)) return;

      console.log('submitting');

      Run.submit({project : projectId}, $scope.protocol).$promise.then(function (d) {
        console.log(d);
        $scope.response = d;
      });
    };

    this.projects = Project.list();
  });
