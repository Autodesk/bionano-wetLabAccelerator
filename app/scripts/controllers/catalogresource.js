'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:CatalogresourcectrlCtrl
 * @description
 * # CatalogresourcectrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
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
