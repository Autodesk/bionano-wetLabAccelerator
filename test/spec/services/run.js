'use strict';

describe('Service: run', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var run;
  beforeEach(inject(function (_run_) {
    run = _run_;
  }));

  it('should do something', function () {
    expect(!!run).toBe(true);
  });

});
