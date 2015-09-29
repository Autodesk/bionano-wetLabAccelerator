'use strict';

describe('Directive: txChangeBroadcaster', function () {

  // load the directive's module
  beforeEach(module('wetLabAccelerator'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-change-broadcaster></tx-change-broadcaster>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txChangeBroadcaster directive');
  }));
});
