'use strict';

describe('Service: runHelperNew', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var runHelperNew;
  beforeEach(inject(function (_runHelperNew_) {
    runHelperNew = _runHelperNew_;
  }));

  it('should do something', function () {
    expect(!!runHelperNew).toBe(true);
  });

});
