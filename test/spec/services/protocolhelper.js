'use strict';

describe('Service: ProtocolHelper', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var ProtocolHelper;
  beforeEach(inject(function (_ProtocolHelper_) {
    ProtocolHelper = _ProtocolHelper_;
  }));

  it('should do something', function () {
    expect(!!ProtocolHelper).toBe(true);
  });

});
