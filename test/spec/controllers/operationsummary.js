'use strict';

describe('Controller: OperationsummaryctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var OperationsummaryctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsummaryctrlCtrl = $controller('OperationsummaryctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
