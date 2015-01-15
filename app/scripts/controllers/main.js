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

    self.protocols = ['aaron-growth', 'growth-curve-generic', 'pcr-example', 'many-steps'];

    self.retrieve = function (protocol) {
      self.selectedProtocol = protocol;
      $http.get('demo_protocols/' + protocol + '.json').success(function(data) {
        //self.exampleProtocol = new ProtocolFactory(data);
        self.exampleProtocol = data;
      });
    };

    self.retrieve(self.protocols[1]);

    function constructRunPayload () {
      return {
        title: self.runTitle,
        protocol: self.exampleProtocol
      }
    }

    function runOrSubmitWrap (toRun) {
      var func = !!toRun ? 'submit' : 'analyze' ,
          scopeToModify = !!toRun ? 'runResponse' : 'analysisResponse';

      $scope[scopeToModify] = {
        processing: true
      };

      Run[func]({project : self.project.url}, constructRunPayload()).$promise.
      then(function runSuccess (d) {
        angular.extend($scope[scopeToModify], {
          processing: false,
          error: false,
          response: d
        });
        console.log(d);
      }, function runFailure (e) {
        angular.extend($scope[scopeToModify], {
          processing: false,
          error: true,
          response: e.data.protocol
        });
        console.log(e);
      });
    }

    this.analyze = angular.bind(self, runOrSubmitWrap, false);
    this.submit = angular.bind(self, runOrSubmitWrap, true);

    this.canSubmitRun = function () {
      return !!this.project && !_.isEmpty(this.exampleProtocol) && !!this.runTitle;
    };
  });
