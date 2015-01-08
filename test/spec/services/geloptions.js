'use strict';

describe('Service: GelOptions', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var GelOptions;
  beforeEach(inject(function (_GelOptions_) {
    GelOptions = _GelOptions_;
  }));

  it('should do something', function () {
    expect(!!GelOptions).toBe(true);
  });

});
