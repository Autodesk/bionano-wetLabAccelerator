'use strict';

describe('Controller: TestingFieldCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var TestingFieldCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestingFieldCtrl = $controller('TestingFieldCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
