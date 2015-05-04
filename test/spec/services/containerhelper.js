'use strict';

describe('Service: ContainerHelper', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var ContainerHelper;
  beforeEach(inject(function (_ContainerHelper_) {
    ContainerHelper = _ContainerHelper_;
  }));

  it('should do something', function () {
    expect(!!ContainerHelper).toBe(true);
  });

});
