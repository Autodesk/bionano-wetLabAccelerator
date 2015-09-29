'use strict';

describe('Directive: txProtocolParameters', function () {

  // load the directive's module
  beforeEach(module('wetLabAccelerator'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-protocol-parameters></tx-protocol-parameters>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txProtocolParameters directive');
  }));
});
