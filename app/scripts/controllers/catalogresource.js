'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:CatalogresourcectrlCtrl
 * @description
 * # CatalogresourcectrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('CatalogResourceCtrl', function ($scope, Catalog) {
    var self = this;

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
        key : ''
      },
      {
        name: 'Item',
        key : 'name'
      },
      /*
      {
        name: 'Aliquot Size',
        key : ''
      },
      {
        name: 'Concentration',
        key : ''
      },
      */
      {
        name: 'Item Cost',
        key : 'cost'
      }
    ];

    $scope.$watch('searchQuery', function (newQuery, oldQuery) {
      (!!newQuery && newQuery != oldQuery) && Catalog.byQuery(newQuery).then(function (data) {
        console.log(data.data);
        self.catalogResults = data.data;
      });
    });

    self.selectItem = function (item) {
      $scope.fieldCtrl.model = item;
      $scope.$close();
    };

  });
