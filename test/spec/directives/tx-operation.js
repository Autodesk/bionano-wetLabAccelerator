'use strict';

describe('Directive: txOperation', function () {

  // load the directive's module
  beforeEach(module('wetLabAccelerator'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-operation></tx-operation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txOperation directive');
  }));
});
