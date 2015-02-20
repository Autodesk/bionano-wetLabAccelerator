'use strict';

/**
 * @ngdoc service
 * @name transcripticApp.mailing
 * @description
 * # mailing
 * Service in the transcripticApp.
 */
angular.module('transcripticApp')
  .service('mailing', function ($resource, Communication, Auth) {
    return $resource(Communication.root + ':organization/containers/:id/mail',
      //defaults
      {
        organization: Auth.organization
      },

      //actions
      {
        /**
         * @name mail
         * @description Request mailing a container from Transcriptic to your lab.
         * @param parameters {null}
         * @param payload {Object} consisting of:
         * condition {String} "ambient" or "dry_ice"
         * address {String} ID identifying a pre-existing address associated with your organization. Addresses must be
         *     validated and approved by Transcriptic before we can send containers to them.
         */
        mail: Communication.defaultResourceActions({
          method: "POST"
        })
      }
    );
  });
