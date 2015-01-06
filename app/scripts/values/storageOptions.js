'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.StorageOptions
 * @description
 * Options for storage, mailing, incubation
 *
 */
angular.module('transcripticApp').constant('StorageOptions', {
  "storage" : ["ambient", "warm_37", "cold_4", "cold_20", "cold_80"],
  "incubate" : ["ambient", "warm_37", "cold_4", "cold_20", "cold_80"],
  "mail" : ["ambient", "dry_ice"]
});
