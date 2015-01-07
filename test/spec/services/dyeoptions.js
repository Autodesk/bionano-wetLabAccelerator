'use strict';

describe('Service: dyeOptions', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var dyeOptions;
  beforeEach(inject(function (_dyeOptions_) {
    dyeOptions = _dyeOptions_;
  }));

  it('should do something', function () {
    expect(!!dyeOptions).toBe(true);
  });

});
