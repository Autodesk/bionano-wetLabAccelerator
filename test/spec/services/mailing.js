'use strict';

describe('Service: mailing', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var mailing;
  beforeEach(inject(function (_mailing_) {
    mailing = _mailing_;
  }));

  it('should do something', function () {
    expect(!!mailing).toBe(true);
  });

});
