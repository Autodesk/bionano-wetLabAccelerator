'use strict';

describe('Directive: txProtocolInput', function () {

  // load the directive's module
  beforeEach(module('wetLabAccelerator'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-protocol-input></tx-protocol-input>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txProtocolInput directive');
  }));
});
