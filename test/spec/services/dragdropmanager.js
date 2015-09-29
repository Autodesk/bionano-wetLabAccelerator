'use strict';

describe('Service: DragDropManager', function () {

  // load the service's module
  beforeEach(module('wetLabAccelerator'));

  // instantiate service
  var DragDropManager;
  beforeEach(inject(function (_DragDropManager_) {
    DragDropManager = _DragDropManager_;
  }));

  it('should do something', function () {
    expect(!!DragDropManager).toBe(true);
  });

});
