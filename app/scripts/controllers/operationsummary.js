'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:OperationsummaryctrlCtrl
 * @description
 * # OperationsummaryctrlCtrl
 * Controller of the transcripticApp
 *
 * todo - rename to match names in protocolUtils
 */
angular.module('transcripticApp')
  .controller('operationSummaryCtrl', function ($scope, $sce, Communication, ProtocolHelper, Omniprotocol, ProtocolUtils) {
    var self = this;

    self.protocol = ProtocolHelper.currentProtocol;

    //general helper functions

    self.getFieldValueByName = applyOpToFn(ProtocolUtils.getFieldValFromOpByName);

    self.readableDimensional = function (dimObj) {
      if (_.isUndefined(dimObj)) {
        return 'unspecified amount';
      }
      return _.result(dimObj, 'value') + ' ' + _.result(dimObj, 'unit') + 's';
    };

    //wells - pipette (mostly)

    self.pluckWellsFromContainer = applyOpToFn(ProtocolUtils.pluckWellsFromAliquots);

    self.getContainerFromWellField = applyOpToFn(ProtocolUtils.getFirstContainerFromAliquots);

    self.getContainerTypeFromWellField = applyOpToFn(ProtocolUtils.getContainerTypeFromAliquots);

    self.getContainerColorFromWellField = applyOpToFn(ProtocolUtils.getContainerColorFromAliquots);

    //functions for fields with type container

    self.getContainerTypeFromFieldName = applyOpToFn(ProtocolUtils.getContainerTypeFromFieldName);

    self.getContainerColorFromFieldName = applyOpToFn(ProtocolUtils.getContainerColorFromFieldName);

    self.getContainerColorFromContainerName = ProtocolUtils.getContainerColorFromContainerName;

    function applyOpToFn (utilFn) {
      return _.partial(utilFn, self.operation);
    }

    // RESOURCE - might be moot with server handling

    self.trustResource = function (url) {
      return $sce.trustAsResourceUrl(url);
    };

    self.getResourceUrl = function (resourceKey) {
      return 'upload/url_for?key=' + encodeURIComponent(resourceKey);
    };

    self.getResource = function (resourceKey) {
      return Communication.request(self.getResourceUrl(resourceKey), 'get', {
        responseType: 'blob',
        headers     : {
          'Accept'      : 'image/jpeg',
          'Content-Type': 'image/jpeg'
        }
      })
        .success(function (data, headers) {
          console.log(data);

          //make this work!

          //expects a blob
          // encode data to base 64 url
          var fr    = new FileReader();
          fr.onload = function () {
            // this variable holds your base64 image data URI (string)
            // use readAsBinary() or readAsBinaryString() below to obtain other data types
            console.log(fr.result);
            self.imageUrl = fr.result;
          };
          fr.readAsDataURL(data);


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
          //todo - support multiple
          self.imageUrl = imageUrl;
          */

        });
    };

  });
