'use strict';

describe('Directive: txRequestresponse', function () {

  // load the directive's module
  beforeEach(module('wetLabAccelerator'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tx-requestresponse></tx-requestresponse>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the txRequestresponse directive');
  }));
});
