'use strict';

describe('Controller: ResultsspectrophotometryctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var ResultsspectrophotometryctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResultsspectrophotometryctrlCtrl = $controller('ResultsspectrophotometryctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
