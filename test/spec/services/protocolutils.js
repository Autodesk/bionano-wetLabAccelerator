'use strict';

describe('Service: ProtocolUtils', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var ProtocolUtils;
  beforeEach(inject(function (_ProtocolUtils_) {
    ProtocolUtils = _ProtocolUtils_;
  }));

  it('should do something', function () {
    expect(!!ProtocolUtils).toBe(true);
  });

});
