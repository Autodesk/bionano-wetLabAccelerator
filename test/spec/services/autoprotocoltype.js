'use strict';

describe('Service: AutoprotocolType', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var AutoprotocolType;
  beforeEach(inject(function (_AutoprotocolType_) {
    AutoprotocolType = _AutoprotocolType_;
  }));

  it('should do something', function () {
    expect(!!AutoprotocolType).toBe(true);
  });

});
