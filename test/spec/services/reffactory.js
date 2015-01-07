'use strict';

describe('Service: RefFactory', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var RefFactory;
  beforeEach(inject(function (_RefFactory_) {
    RefFactory = _RefFactory_;
  }));

  it('should do something', function () {
    expect(!!RefFactory).toBe(true);
  });

});
