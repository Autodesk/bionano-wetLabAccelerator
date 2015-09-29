'use strict';

describe('Directive: txOperationSummary', function () {

  // load the directive's module
  beforeEach(module('wetLabAccelerator'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-operation-summary></tx-operation-summary>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txOperationSummary directive');
  }));
});
