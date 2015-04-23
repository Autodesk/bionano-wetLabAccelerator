'use strict';

describe('Controller: TestingResultsCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var TestingResultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestingResultsCtrl = $controller('TestingResultsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
