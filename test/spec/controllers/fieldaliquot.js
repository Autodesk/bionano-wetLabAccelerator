'use strict';

describe('Controller: FieldaliquotctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var FieldaliquotctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FieldaliquotctrlCtrl = $controller('FieldaliquotctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
