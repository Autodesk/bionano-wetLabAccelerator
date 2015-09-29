'use strict';

/**
 * @ngdoc service
 * @name wetLabAccelerator.mailing
 * @description
 * # mailing
 * Service in the wetLabAccelerator.
 */
angular.module('tx.communication')
  .service('mailing', function ($resource, Communication, TranscripticAuth) {
    return $resource(Communication.root + ':organization/containers/:id/mail',
      //defaults
      {
        organization: TranscripticAuth.organization
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
