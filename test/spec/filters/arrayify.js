'use strict';

describe('Filter: arrayify', function () {

  // load the filter's module
  beforeEach(module('transcripticApp'));

  // initialize a new instance of the filter before each test
  var arrayify;
  beforeEach(inject(function ($filter) {
    arrayify = $filter('arrayify');
  }));

  it('should return the input prefixed with "arrayify filter:"', function () {
    var text = 'angularjs';
    expect(arrayify(text)).toBe('arrayify filter: ' + text);
  });

});
