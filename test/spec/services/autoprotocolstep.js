'use strict';

describe('Service: AutoprotocolStep', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var AutoprotocolStep;
  beforeEach(inject(function (_AutoprotocolStep_) {
    AutoprotocolStep = _AutoprotocolStep_;
  }));

  it('should do something', function () {
    expect(!!AutoprotocolStep).toBe(true);
  });

});
