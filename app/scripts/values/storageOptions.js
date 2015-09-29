'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.StorageOptions
 * @description
 * Options for storage, mailing, incubation
 *
 */
//todo - incorporate discard in a better way... maybe add $$readable which will be stripped
angular.module('wetLabAccelerator').constant('StorageOptions', {
  "storage" : ["ambient", "warm_37", "cold_4", "cold_20", "cold_80"],
  "incubate" : ["ambient", "warm_37", "cold_4", "cold_20", "cold_80"],
  "mail" : ["ambient", "dry_ice"]
});
