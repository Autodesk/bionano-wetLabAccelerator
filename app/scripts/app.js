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
    .when('/testing', {
      templateUrl: 'views/testing.html',
      controller: 'TestingCtrl',
      controllerAs: 'testCtrl'
    })
    .when('/auth', {
      templateUrl: 'views/auth.html'
    })
    .when('/ordering', {
      templateUrl: 'views/ordering.html',
      controller: 'OrderingCtrl',
      controllerAs: 'orderCtrl'
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
