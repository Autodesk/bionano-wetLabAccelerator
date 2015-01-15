'use strict';

describe('Controller: OrderingCtrl', function () {

  // load the controller's module
  beforeEach(module('transcripticApp'));

  var OrderingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrderingCtrl = $controller('OrderingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
