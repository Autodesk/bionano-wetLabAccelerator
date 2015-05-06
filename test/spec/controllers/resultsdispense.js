'use strict';

describe('Controller: ResultsdispensectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var ResultsdispensectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResultsdispensectrlCtrl = $controller('ResultsdispensectrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
