'use strict';

describe('Controller: ResultspipettectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var ResultspipettectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResultspipettectrlCtrl = $controller('ResultspipettectrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
