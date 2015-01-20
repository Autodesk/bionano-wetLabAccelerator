'use strict';

describe('Directive: txWellplate', function () {

  // load the directive's module
  beforeEach(module('transcripticApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-wellplate></tx-wellplate>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txWellplate directive');
  }));
});
