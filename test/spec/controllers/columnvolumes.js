'use strict';

describe('Controller: ColumnvolumesctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var ColumnvolumesctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ColumnvolumesctrlCtrl = $controller('ColumnvolumesctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
