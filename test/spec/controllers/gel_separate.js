'use strict';

describe('Controller: GelSeparateCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var GelSeparateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GelSeparateCtrl = $controller('GelSeparateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
