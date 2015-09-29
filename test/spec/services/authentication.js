'use strict';

describe('Service: Authentication', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var Authentication;
  beforeEach(inject(function (_Authentication_) {
    Authentication = _Authentication_;
  }));

  it('should do something', function () {
    expect(!!Authentication).toBe(true);
  });

});
