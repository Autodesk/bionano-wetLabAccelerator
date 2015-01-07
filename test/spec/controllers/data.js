'use strict';

describe('Controller: DataCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var DataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataCtrl = $controller('DataCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
