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
 * @name wetLabAccelerator.controller:OperationsummaryctrlCtrl
 * @description
 * # OperationsummaryctrlCtrl
 * Controller of the wetLabAccelerator
 *
 * todo - rename to match names in protocolUtils
 */
angular.module('wetLabAccelerator')
  .controller('operationSummaryCtrl', function ($scope, $sce, Communication, ProtocolHelper, Omniprotocol, ProtocolUtils, TranscripticAuth, RunHelper, $window, $timeout) {
    var self = this;

    self.protocol = ProtocolHelper.currentProtocol;

    //general helper functions

    self.getFieldValueByName = applyOpToFn(ProtocolUtils.getFieldValue);

    self.readableDimensional = function (dimObj) {
      if (_.isUndefined(dimObj)) {
        return 'unspecified amount';
      }
      return _.result(dimObj, 'value') + ' ' + _.result(dimObj, 'unit') + 's';
    };

    //wells - pipette (mostly)

    self.pluckWellsFromContainer = applyOpToFn(ProtocolUtils.pluckWellsFromAliquots);

    self.getContainerNameFromWellField = applyOpToFn(ProtocolUtils.getContainerNameFromAliquots);

    self.getContainerTypeFromWellField = applyOpToFn(ProtocolUtils.getContainerTypeFromAliquots);

    self.getContainerColorFromWellField = applyOpToFn(ProtocolUtils.getContainerColorFromAliquots);

    //functions for fields with type container

    self.getContainerNameFromFieldName = applyOpToFn(ProtocolUtils.getContainerNameFromFieldName);

    self.getContainerTypeFromFieldName = applyOpToFn(ProtocolUtils.getContainerTypeFromFieldName);

    self.getContainerColorFromFieldName = applyOpToFn(ProtocolUtils.getContainerColorFromFieldName);

    function applyOpToFn (utilFn) {
      return function () {
        var args = _.slice(arguments);
        return utilFn.apply(self, [self.operation].concat(args));
      }
    }

    self.getResourcesForOp = function () {
      if (_.isEmpty(self.indices)) {
        return [];
      }

      var datarefRaw  = self.getFieldValueByName('dataref'),
          //hack - interpolate, assuming that needed index is available here...
          datarefName = Omniprotocol.utils.interpolateObject(datarefRaw, self.indices);

      return _(self.runData)
        .filter(function (data, dataref) {
          return dataref == datarefName;
        })
        .map(function (data, index) {
          return {
            projectId: _.result(RunHelper.currentRun, 'metadata.transcripticProjectId'),
            runId    : _.result(data, 'instruction.run.id'),
            dataref  : datarefName,
            id       : _.result(data, 'id', '')
          };
        })
        .flatten()
        .value()
    };

    // RESOURCE - might be moot with server handling

    self.trustResource = function (url) {
      return $sce.trustAsResourceUrl(url);
    };

    self.getResourceUrlPath = function (resource) {
      // return 'upload/url_for?key=' + encodeURIComponent(resourceKey); //old way
      //return '-/' + resourceId + '.raw'; //CORS

      //hack - relying on currentRun in generating resources above

      //link in form
      //https://secure.transcriptic.com/:organization/:project/datasets/:dataId
      return TranscripticAuth.organization() + '/' +
        resource.projectId + '/datasets/' +
        resource.id + '?format=raw';
    };

    //todo
    self.getDatarefUrlPath = function () {
      var resources = self.getResourcesForOp(),
          first     = resources[0],
          url       = TranscripticAuth.organization() + '/' +
            first.projectId + '/runs/' +
            first.runId + '/data/' +
            first.dataref;

      return url;
    };

    //gives full URL
    self.getResourceUrl = function (resource) {
      return Communication.requestUrl(self.getResourceUrlPath(resource));
    };

    self.getResource = function (resource) {
      console.log(resource);

      $timeout(function () {
        resource.status = 'Still loading...'
      }, 10000);

      return Communication.request(self.getResourceUrlPath(resource), 'get', {
        timeout     : 60000,
        responseType: 'blob',
        headers     : {
          'Accept'      : 'image/jpeg',
          'Content-Type': 'image/jpeg'
        }
      })
        .error(function (data, status) {
          console.log('resource request error', data, status);
          if (status == 0) {
            resource.status = 'Request timed out. Please Download';
          }
          else if (status > 400) {
            resource.status = "You don't have access to view this file...";
          }
          else {
            resource.status = "There was an error downloading this image. Try downloading it, or visit Transcriptic directly."
          }
        })
        .success(function (data, headers) {
          console.log('received!');
          console.log(data);

          var blob             = new $window.Blob([data], {type: 'image/jpeg'});
          var blobUrl          = $window.URL.createObjectURL(blob);
          resource.resourceUrl = blobUrl;

          /*

          //expects a blob
          // encode data to base 64 url
          var fr    = new FileReader();
          fr.onload = function () {
            // this variable holds your base64 image data URI (string)
            // use readAsBinary() or readAsBinaryString() below to obtain other data types
            //console.log(fr.result);
            var imageUrl = fr.result.replace(/^data:binary\/octet-stream/, 'data:image/jpeg');
            //console.log(imageUrl);

            $scope.$applyAsync(function () {
              //default attach to ourself, otherwise use attachTo
              self.resourceUrl = imageUrl;

              if (_.isObject(resource)) {
                resource.resourceUrl = imageUrl;
              }
            })
          };

          fr.readAsDataURL(data);

*/
          /*
          var binary = '';
          var bytes = new Uint8Array( data );
          var len = bytes.byteLength;
          for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
          }
          console.log(window.btoa( binary ));
          */

          /*
          var arrayBufferView = new Uint8Array( data );
          var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL( blob );

          console.log(imageUrl);
          */
        });
    };

  });
