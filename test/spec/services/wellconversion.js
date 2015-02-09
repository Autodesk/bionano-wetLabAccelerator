'use strict';

describe('Service: wellConversion', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var wellConversion;
  beforeEach(inject(function (_wellConversion_) {
    wellConversion = _wellConversion_;
  }));

  it('should do something', function () {
    expect(!!wellConversion).toBe(true);
  });

});
