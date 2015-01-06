'use strict';

describe('Service: dimensions', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var dimensions;
  beforeEach(inject(function (_dimensions_) {
    dimensions = _dimensions_;
  }));

  it('should do something', function () {
    expect(!!dimensions).toBe(true);
  });

});
