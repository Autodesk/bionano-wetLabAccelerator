'use strict';

describe('Directive: txInstruction', function () {

  // load the directive's module
  beforeEach(module('transcripticApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-instruction></tx-instruction>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txInstruction directive');
  }));
});
