'use strict';

describe('Filter: fieldReadable', function () {

  // load the filter's module
  beforeEach(module('transcripticApp'));

  // initialize a new instance of the filter before each test
  var fieldReadable;
  beforeEach(inject(function ($filter) {
    fieldReadable = $filter('fieldReadable');
  }));

  it('should return the input prefixed with "fieldReadable filter:"', function () {
    var text = 'angularjs';
    expect(fieldReadable(text)).toBe('fieldReadable filter: ' + text);
  });

});
