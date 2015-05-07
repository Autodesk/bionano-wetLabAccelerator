'use strict';

describe('Directive: txColumnVolumes', function () {

  // load the directive's module
  beforeEach(module('transcripticApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-column-volumes></tx-column-volumes>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txColumnVolumes directive');
  }));
});
