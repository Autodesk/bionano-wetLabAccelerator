'use strict';

describe('Service: ConversionUtils', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var ConversionUtils;
  beforeEach(inject(function (_ConversionUtils_) {
    ConversionUtils = _ConversionUtils_;
  }));

  it('should do something', function () {
    expect(!!ConversionUtils).toBe(true);
  });

});
