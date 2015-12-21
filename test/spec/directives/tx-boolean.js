'use strict';

describe('Directive: txBoolean', function () {

  // load the directive's module
  beforeEach(module('wetLabAccelerator'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-boolean></tx-boolean>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txBoolean directive');
  }));
});
