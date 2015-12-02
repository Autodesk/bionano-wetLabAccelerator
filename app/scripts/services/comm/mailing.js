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
