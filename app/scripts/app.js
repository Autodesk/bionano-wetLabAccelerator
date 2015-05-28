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
        templateUrl: 'views/testing/field.html',
        controller: 'TestingFieldCtrl',
        controllerAs: 'testingFieldCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function (simpleLogin, Platform, $rootScope, $location) {

    $rootScope.$on('$locationChangeSuccess', function () {
      $rootScope.currentPath = $location.path();
    })
  });
