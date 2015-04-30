'use strict';

describe('Service: UUIDGen', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var UUIDGen;
  beforeEach(inject(function (_UUIDGen_) {
    UUIDGen = _UUIDGen_;
  }));

  it('should do something', function () {
    expect(!!UUIDGen).toBe(true);
  });

});
