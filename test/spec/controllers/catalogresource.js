'use strict';

describe('Controller: CatalogresourcectrlCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var CatalogresourcectrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CatalogresourcectrlCtrl = $controller('CatalogresourcectrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
