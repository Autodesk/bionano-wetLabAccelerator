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
    'ui.sortable',
    'angularFileUpload',
    'firebase'
  ])
  .config(function ($routeProvider) {

    $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'mainCtrl'
    })
    .when('/data', {
      templateUrl: 'views/data.html',
      controller: 'DataCtrl',
      controllerAs: 'dataCtrl'
    })
    .when('/auth', {
      templateUrl: 'views/auth.html'
    })
    .when('/ordering', {
      templateUrl: 'views/ordering.html',
      controller: 'OrderingCtrl',
      controllerAs: 'orderCtrl'
    })
    .when('/testing/plate', {
      templateUrl: 'views/testing/plate.html',
      controller: 'TestingPlateCtrl',
      controllerAs: 'testCtrl'
    })
    .when('/testing/restyle', {
      templateUrl: 'views/testing/restyle.html',
      controller: 'TestingRestyleCtrl'
    })
    .when('/testing/dottest', {
      templateUrl: 'views/testing/dottest.html',
      controller: 'DottestCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  })
  .run(function (simpleLogin) {});
