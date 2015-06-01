'use strict';

/**
 * @ngdoc overview
 * @name transcripticApp
 * @description
 * # transcripticApp
 *
 * Main module of the application.
 */
angular
  .module('transcripticApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'angularFileUpload',
    'firebase',
    'tx.communication',
    'tx.datavis',
    'tx.protocolEditor'
  ])
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/routes/home.html'
      })

      //main routes

      .when('/gallery', {
        templateUrl : 'views/routes/gallery.html',
        controller  : 'GalleryCtrl',
        controllerAs: 'galleryCtrl'
      })
      .when('/protocol', {
        templateUrl : 'views/routes/build.html',
        controller  : 'BuildCtrl',
        controllerAs: 'restyleCtrl' //todo - rename to ProtocolCtrl, make sure not passed down and breaking
      })
      .when('/results', {
        templateUrl : 'views/routes/results.html',
        controller  : 'ResultsCtrl',
        controllerAs: 'resultsCtrl'
      })
      .when('/auth', {
        templateUrl: 'views/routes/auth.html'
      })

      /*
      //old routes

      .when('/protocol', {
        templateUrl : 'views/protocol.html',
        controller  : 'ProtocolCtrl',
        controllerAs: 'mainCtrl'
      })
      .when('/data', {
        templateUrl : 'views/data.html',
        controller  : 'DataCtrl',
        controllerAs: 'dataCtrl'
      })
      .when('/ordering', {
        templateUrl : 'views/ordering.html',
        controller  : 'OrderingCtrl',
        controllerAs: 'orderCtrl'
      })

      */

      //testing routes

      .when('/testing', {
        redirectTo: '/testing/plate'
      })
      .when('/testing/plate', {
        templateUrl : 'views/testing/plate.html',
        controller  : 'TestingPlateCtrl',
        controllerAs: 'testCtrl'
      })
      .when('/testing/field', {
        templateUrl : 'views/testing/field.html',
        controller  : 'TestingFieldCtrl',
        controllerAs: 'testingFieldCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function (simpleLogin, Authentication, $rootScope, $location, FBProfile, $q, Platform, Database) {

    $rootScope.$on('$locationChangeSuccess', function () {
      $rootScope.currentPath = $location.path();
    });

    //testing - importing of runs and protocols

    simpleLogin.watch(function (user) {
      if (!!user) {
        //note - firebase
        var firebaseRunSync = new FBProfile(user.uid, 'runs');
        var firebaseRuns    = firebaseRunSync.$asArray();

        var firebaseProtocolSync = new FBProfile(user.uid, 'omniprotocols');
        var firebaseProtocols    = firebaseProtocolSync.$asArray();

        Platform.authenticate('maxwell@autodesk.com')
          .then(firebaseProtocols.$loaded)
          .then(function () {
            //use only if uploading to DB
            return $q.all(_.map(firebaseProtocols, function (protocol) {
              var pruned = Database.removeExtraneousFields(protocol);
              if (_.has(pruned, 'groups')) {
                return Platform.saveProject(pruned);
              }
            }));
          });

        Platform.authenticate('maxwell@autodesk.com')
          .then(firebaseRuns.$loaded)
          .then(function () {
            //use only if uploading to DB
            return $q.all(_.map(firebaseRuns, function (protocol) {
              var pruned = Database.removeExtraneousFields(protocol);
              return Platform.saveProject(pruned);
            }));
          })
          .then(Platform.get_all_project_ids)
          .then(function (rpc) {
            console.log(rpc);
            return $q.all(_.map(rpc.result, Platform.getProject));
          })
          .then(function (projects) {
            return _.map(projects, Database.removeExtraneousFields);
          })
          .then(console.log.bind(console));
      }
    });

  });
