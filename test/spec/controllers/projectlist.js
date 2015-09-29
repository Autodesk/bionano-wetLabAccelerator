'use strict';

describe('Controller: ProjectlistCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var ProjectlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectlistCtrl = $controller('ProjectlistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
