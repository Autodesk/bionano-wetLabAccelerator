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
    'tx.communication',
    'tx.datavis',
    'tx.protocolEditor'
  ])
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        controller  : 'HomeCtrl',
        controllerAs: 'homeCtrl',
        templateUrl : 'views/routes/home.html',
        resolve: {
          'isAuthenticated' : ['Authentication', '$location', function (Authentication, $location) {
            //todo - may want to actually check? or slow?
            return Authentication.isAuthenticatedLocal()
              .then(function (isAuth) {
              if (isAuth) {
                $location.path('/protocol');
              }
            })
          }]
        }
      })

      //main routes

      .when('/protocol', {
        templateUrl : 'views/routes/protocol.html',
        controller  : 'ProtocolCtrl',
        controllerAs: 'restyleCtrl', //todo - rename to ProtocolCtrl, make sure not passed down and breaking
        resolve     : {
          protocol: ['ProtocolHelper', function (ProtocolHelper) {
            if (_.isEmpty(ProtocolHelper.currentProtocol)) {
              ProtocolHelper.assignCurrentProtocol(ProtocolHelper.createNewProtocol());
            }
          }]
        }
      })
      .when('/results', {
        templateUrl : 'views/routes/results.html',
        controller  : 'ResultsCtrl',
        controllerAs: 'resultsCtrl'
      })

      /*
      .when('/auth', {
        templateUrl: 'views/routes/auth.html'
      })
      */

      //testing routes

      /*
      .when('/gallery', {
        templateUrl : 'views/routes/gallery.html',
        controller  : 'GalleryCtrl',
        controllerAs: 'galleryCtrl'
      })
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
      */
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function (Authentication, Platform, Database, $document) {
    //lazy load the background image
    angular.element($document[0].body).addClass('with-background');
  });
