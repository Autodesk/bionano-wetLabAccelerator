'use strict';

describe('Service: Container', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var Container;
  beforeEach(inject(function (_Container_) {
    Container = _Container_;
  }));

  it('should do something', function () {
    expect(!!Container).toBe(true);
  });

});
