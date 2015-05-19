'use strict';

describe('Directive: popoverTransclude', function () {

  // load the directive's module
  beforeEach(module('transcripticApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<popover-transclude></popover-transclude>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the popoverTransclude directive');
  }));
});
