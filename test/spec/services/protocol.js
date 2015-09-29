'use strict';

describe('Service: Protocol', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var Protocol;
  beforeEach(inject(function (_Protocol_) {
    Protocol = _Protocol_;
  }));

  it('should do something', function () {
    expect(!!Protocol).toBe(true);
  });

});
