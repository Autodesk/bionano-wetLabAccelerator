'use strict';

describe('Controller: TestingRestyleCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var TestingRestyleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestingRestyleCtrl = $controller('TestingRestyleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
