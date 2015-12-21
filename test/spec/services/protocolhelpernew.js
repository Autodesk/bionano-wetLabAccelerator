'use strict';

describe('Service: protocolHelperNew', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var protocolHelperNew;
  beforeEach(inject(function (_protocolHelperNew_) {
    protocolHelperNew = _protocolHelperNew_;
  }));

  it('should do something', function () {
    expect(!!protocolHelperNew).toBe(true);
  });

});
