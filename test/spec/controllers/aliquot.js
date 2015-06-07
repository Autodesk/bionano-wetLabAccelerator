'use strict';

describe('Controller: AliquotCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var AliquotCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AliquotCtrl = $controller('AliquotCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
