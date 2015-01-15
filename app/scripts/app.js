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
    'ui.sortable'
  ])
  .config(function ($routeProvider, AuthProvider) {

    angular.extend(AuthProvider, {
      email : "max.bates@autodesk.com",
      key : "U4J-_G7vy-CKZwQsDNMw",
      organization : "autodesk-cyborg"
    });

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
        controller: 'RefsCtrl',
        controllerAs: 'refsCtrl'
      })
      .when('/auth', {
        templateUrl: 'views/auth.html',
        controller: 'AuthCtrl',
        controllerAs: 'authCtrl'
      })
      .when('/ordering', {
        templateUrl: 'views/ordering.html',
        controller: 'OrderingCtrl',
        controllerAs: 'orderCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
