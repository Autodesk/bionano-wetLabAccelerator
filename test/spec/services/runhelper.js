'use strict';

describe('Service: RunHelper', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var RunHelper;
  beforeEach(inject(function (_RunHelper_) {
    RunHelper = _RunHelper_;
  }));

  it('should do something', function () {
    expect(!!RunHelper).toBe(true);
  });

});
