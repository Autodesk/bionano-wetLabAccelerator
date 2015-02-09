'use strict';

describe('Directive: txTimepointgraph', function () {

  // load the directive's module
  beforeEach(module('transcripticApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-timepointgraph></tx-timepointgraph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txTimepointgraph directive');
  }));
});
