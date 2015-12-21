'use strict';

describe('Service: instructions', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var instructions;
  beforeEach(inject(function (_instructions_) {
    instructions = _instructions_;
  }));

  it('should do something', function () {
    expect(!!instructions).toBe(true);
  });

});
