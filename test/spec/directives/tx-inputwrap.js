'use strict';

describe('Directive: txInputwrap', function () {

  // load the directive's module
  beforeEach(module('wetLabAccelerator'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-inputwrap></tx-inputwrap>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txInputwrap directive');
  }));
});
