'use strict';

describe('Controller: DottestCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var DottestCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DottestCtrl = $controller('DottestCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
