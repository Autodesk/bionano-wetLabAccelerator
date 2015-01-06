'use strict';

describe('Service: containers', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var containers;
  beforeEach(inject(function (_containers_) {
    containers = _containers_;
  }));

  it('should do something', function () {
    expect(!!containers).toBe(true);
  });

});
