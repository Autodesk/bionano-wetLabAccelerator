'use strict';

describe('Service: Instruction', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate service
  var Instruction;
  beforeEach(inject(function (_Instruction_) {
    Instruction = _Instruction_;
  }));

  it('should do something', function () {
    expect(!!Instruction).toBe(true);
  });

});
