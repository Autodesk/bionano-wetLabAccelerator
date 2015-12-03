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
 * @ngdoc function
 * @name wetLabAccelerator.controller:CatalogresourcectrlCtrl
 * @description
 * # CatalogresourcectrlCtrl
 * Controller of the wetLabAccelerator
 */
angular.module('wetLabAccelerator')
  .controller('CatalogResourceCtrl', function ($scope, $rootScope, Catalog) {
    var self = this;

    //be sure to use ng-if on containing element for field values, since should only assume model is accurate when not using parameters

    self.init = function () {
      Catalog.query().then(function (data) {
        self.catalogResults    = data.data.results;
        self.catalogVendors    = _.result(data.data, 'facets.vendors');
        self.catalogCategories = _.result(data.data, 'facets.categories');
      });
    };

    //key is readable, val is transcriptic field name
    self.itemFields = [
      {
        name: 'Type',
        key : 'kind'
      },
      {
        name: 'Item',
        key : 'name'
      }
    ];

    $scope.$watch('searchQuery', function (newQuery, oldQuery) {
      Catalog.byQuery(newQuery).then(function (data) {
        self.catalogResults = data.data;
      });
    });

    self.selectItem = function (item) {
      //todo - refactor to fieldCtrl.assignFieldValue
      $scope.fieldCtrl.model = item;
      $rootScope.$broadcast('$modalClose');
    };

  });
