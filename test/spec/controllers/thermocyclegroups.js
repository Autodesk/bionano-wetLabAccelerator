'use strict';

describe('Controller: ThermocyclegroupsctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var ThermocyclegroupsctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThermocyclegroupsctrlCtrl = $controller('ThermocyclegroupsctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
