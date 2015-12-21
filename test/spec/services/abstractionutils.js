'use strict';

describe('Service: AbstractionUtils', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var AbstractionUtils;
  beforeEach(inject(function (_AbstractionUtils_) {
    AbstractionUtils = _AbstractionUtils_;
  }));

  it('should do something', function () {
    expect(!!AbstractionUtils).toBe(true);
  });

});
