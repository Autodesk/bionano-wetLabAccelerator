'use strict';

describe('Controller: ConsolidateCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var ConsolidateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConsolidateCtrl = $controller('ConsolidateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
