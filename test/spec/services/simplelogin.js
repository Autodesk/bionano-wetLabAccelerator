'use strict';

describe('Service: simpleLogin', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var simpleLogin;
  beforeEach(inject(function (_simpleLogin_) {
    simpleLogin = _simpleLogin_;
  }));

  it('should do something', function () {
    expect(!!simpleLogin).toBe(true);
  });

});
