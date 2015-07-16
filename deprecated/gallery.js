'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:GalleryCtrl
 * @description
 * # GalleryCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('GalleryCtrl', function ($scope, $http) {

    var self = this;

    //how to make this dynamic?
    self.baltimore_groups = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

    var theStuff = {
      protocol: {
        directory: "demo_protocols/omniprotocol",
        items    : ['protocol_dummy', 'protocol_transfer', 'digest']
      },
      virus   : {
        directory: "demo_viruses",
        items    : ['virus_hiv', 'virus_phix']
      },
      run     : {
        directory: "demo_runs",
        items    : _.map(['', '2', '3'], function (suffix) { return 'run_dummy' + suffix })
      }
    };

    self.appTypes = _.keys(theStuff);

    self.allTheStuff = [];

    //todo - authors

    //todo - tags sorting - dynamic based on information present

    _.forEach(theStuff, function (stuff, cat) {
      _.forEach(stuff.items, function (item) {
        $http.get(stuff.directory + '/' + item + '.json', {cache: true})
          .success(function (data) {
            self.allTheStuff.push(data);
          });
      });
    });

    // filters

    //todo - dynamic from list
    self.filters = {
      metadata: {
        $: "",
        type: ""
      },
      baltimore_group: ""
    };

    //use this function for more intelligent handling (e.g. allowing groups, but then need custom filter)
    self.toggleFilter = function (filter, force, isMetadata) {
      //todo - handle force
      var key = _.keys(filter)[0];

      if (isMetadata) {
        if (self.filters.metadata[key]) {
          delete self.filters.metadata[key];
        } else {
          _.assign(self.filters.metadata, filter);
        }
      }
      else {
        if (self.filters[key]) {
          delete self.filters[key];
        }
        else {
          _.assign(self.filters, filter);
        }
      }
    };


    /*
    //for converting uppercase JSONs to lowercase
    var myJson      = {"your": "json here"},
        transformer = function (result, val, key) {
          var newkey     = key.toLowerCase().replace(' ', '_');
          result[newkey] = _.isObject(val) ? _.transform(val, transformer) : val;
          return result;
        },
        transformed = _.transform(myJson, transformer, {});
    */
  });
