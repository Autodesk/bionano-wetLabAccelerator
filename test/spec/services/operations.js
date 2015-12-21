'use strict';

describe('Service: operations', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var operations;
  beforeEach(inject(function (_operations_) {
    operations = _operations_;
  }));

  it('should do something', function () {
    expect(!!operations).toBe(true);
  });

});
