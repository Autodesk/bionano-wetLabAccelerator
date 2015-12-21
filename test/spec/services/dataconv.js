'use strict';

describe('Service: DataConv', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var DataConv;
  beforeEach(inject(function (_DataConv_) {
    DataConv = _DataConv_;
  }));

  it('should do something', function () {
    expect(!!DataConv).toBe(true);
  });

});
