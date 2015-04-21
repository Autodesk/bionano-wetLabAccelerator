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
    'firebase',
    'tx.communication',
    'tx.datavis',
    'tx.protocolEditor'
  ])
  .config(function ($routeProvider) {

    $routeProvider
    .when('/', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .when('/protocol', {
      templateUrl: 'views/protocol.html',
      controller: 'ProtocolCtrl',
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
    .when('/testing', {
      redirectTo: '/testing/plate'
    })
    .when('/testing/plate', {
      templateUrl: 'views/testing/plate.html',
      controller: 'TestingPlateCtrl',
      controllerAs: 'testCtrl'
    })
    .when('/testing/restyle', {
      templateUrl: 'views/testing/restyle.html',
      controller: 'TestingRestyleCtrl',
      controllerAs: 'restyleCtrl'
    })
    .when('/testing/dottest', {
      templateUrl: 'views/testing/dottest.html',
      controller: 'DottestCtrl'
    })
    .when('/testing/conversion', {
      templateUrl: 'views/testing/conversion.html',
      controller: 'TestingConversionCtrl'
    })
    .when('/testing/results', {
      templateUrl: 'views/testing/results.html',
      controller: 'TestingResultsCtrl',
      controllerAs: 'resultsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  })
  .run(function (simpleLogin) {});
