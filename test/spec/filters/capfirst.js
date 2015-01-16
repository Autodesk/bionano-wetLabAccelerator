'use strict';

describe('Filter: capfirst', function () {

  // load the filter's module
  beforeEach(module('transcripticApp'));

  // initialize a new instance of the filter before each test
  var capfirst;
  beforeEach(inject(function ($filter) {
    capfirst = $filter('capfirst');
  }));

  it('should return the input prefixed with "capfirst filter:"', function () {
    var text = 'angularjs';
    expect(capfirst(text)).toBe('capfirst filter: ' + text);
  });

});
