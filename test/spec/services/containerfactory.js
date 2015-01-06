'use strict';

describe('Service: ContainerFactory', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var ContainerFactory;
  beforeEach(inject(function (_ContainerFactory_) {
    ContainerFactory = _ContainerFactory_;
  }));

  it('should do something', function () {
    expect(!!ContainerFactory).toBe(true);
  });

});
