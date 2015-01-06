'use strict';

describe('Service: OrderingOptions', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var OrderingOptions;
  beforeEach(inject(function (_OrderingOptions_) {
    OrderingOptions = _OrderingOptions_;
  }));

  it('should do something', function () {
    expect(!!OrderingOptions).toBe(true);
  });

});
