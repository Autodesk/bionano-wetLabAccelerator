'use strict';

describe('Directive: txContainer', function () {

  // load the directive's module
  beforeEach(module('transcripticApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-container></tx-container>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txContainer directive');
  }));
});
