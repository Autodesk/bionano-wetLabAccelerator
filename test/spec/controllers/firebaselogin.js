'use strict';

describe('Controller: FirebaseloginCtrl', function () {

  // load the controller's module
  beforeEach(module('wetLabAccelerator'));

  var FirebaseloginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FirebaseloginCtrl = $controller('FirebaseloginCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
