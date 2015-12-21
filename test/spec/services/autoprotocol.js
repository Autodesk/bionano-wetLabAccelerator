'use strict';

describe('Service: autoprotocol', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var autoprotocol;
  beforeEach(inject(function (_autoprotocol_) {
    autoprotocol = _autoprotocol_;
  }));

  it('should do something', function () {
    expect(!!autoprotocol).toBe(true);
  });

});
