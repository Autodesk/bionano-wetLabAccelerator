/**
 * Copyright 2015 Autodesk Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * @ngdoc overview
 * @name wetLabAccelerator
 * @description
 * # wetLabAccelerator
 *
 * Main module of the application.
 */
angular
  .module('wetLabAccelerator', [
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
