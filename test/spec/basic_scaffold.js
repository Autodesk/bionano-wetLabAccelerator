'use strict';

/*

todo

- need some example omniprotocols, error autoprotocols, valid autoprotocols

useful tests

- functions exist on conversion libraries
- maybe a couple large-scope unit tests
- conversion from sample omniprotocols to autoprotocols
- authenticated (don't get 401 from transcriptic)
- protocols verified against transcriptic
  - ones that work
  - ones that don't work
- mocked backend

 */

describe('Basic Test Suite', function () {

  // load the service's module
  beforeEach(module('transcripticApp'));

  // instantiate services
  var run,
      auth,
      op,
      ap,
      analyzeWrapped;

  var testingCredentials = {
    organization: 'autodesk-cyborg',
    key         : 'U4J-_G7vy-CKZwQsDNMw',
    email       : 'max.bates@autodesk.com'
  };

  var testingProjectKey = 'p17mwadkmegyb';

  beforeEach(inject(function (_run_, _Auth_, _Omniprotocol_, _Autoprotocol_) {
    auth = _Auth_;
    op   = _Omniprotocol_;
    ap   = _Autoprotocol_;
    run  = _run_;

    auth.organization(testingCredentials.organization);
    auth.key(testingCredentials.key);
    auth.email(testingCredentials.email);

    analyzeWrapped = run.analyze.bind(null, {project: 'testingProjectKey'});
  }));

  it('should verify an example protocol', function (done) {

    var omniprotocol = {}; // todo - need this

    var autoprotocol = ap.fromAbstraction(omniprotocol);

    var checker = jasmine.createSpy('successChecker');

    analyzeWrapped(autoprotocol)
        .then(checker, function failure () {})
        .then(function () {
          expect(checker).toHaveBeenCalled();
        })
        .then(done);
  });

});
