'use strict';

describe('Service: Database', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var Database;
  beforeEach(inject(function (_Database_) {
    Database = _Database_;
  }));

  it('should do something', function () {
    expect(!!Database).toBe(true);
  });

});
