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
        templateUrl : 'views/routes/home.html'
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
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function (Authentication, Database, $document) {
    //lazy load the background image
    angular.element($document[0].body).addClass('with-background');
  });
