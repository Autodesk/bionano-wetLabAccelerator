'use strict';

describe('Controller: ThermocycledyesCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var ThermocycledyesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThermocycledyesCtrl = $controller('ThermocycledyesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
