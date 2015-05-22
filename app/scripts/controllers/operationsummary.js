'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:OperationsummaryctrlCtrl
 * @description
 * # OperationsummaryctrlCtrl
 * Controller of the transcripticApp
 */
angular.module('transcripticApp')
  .controller('operationSummaryCtrl', function ($scope, $sce, Communication, ProtocolHelper, Omniprotocol) {
    var self = this;

    self.protocol = ProtocolHelper.currentProtocol;

    //general helper functions

    self.getFieldValueByName = function (fieldName) {
      return Omniprotocol.utils.pluckFieldValueRaw(self.operation.fields, fieldName);
    };

    self.readableDimensional = function (dimObj) {
      if (_.isUndefined(dimObj)) {
        return 'unspecified amount';
      }
      return _.result(dimObj, 'value') + ' ' + _.result(dimObj, 'unit') + 's';
    };

    //wells - pipette (mostly)

    self.pluckWellsFromContainer = function (fieldName, container) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw(self.operation.fields, fieldName),
          filterFunction = _.isUndefined(container) ? _.constant(true) : _.matches({container: container});
      return _.pluck(_.filter(fieldVal, filterFunction), 'well');
    };

    self.getContainerFromWellField = function (fieldName) {
      var fieldVal = Omniprotocol.utils.pluckFieldValueRaw(self.operation.fields, fieldName);
      return _.result(fieldVal, '[0].container');
    };

    self.getContainerTypeFromWellField = function (fieldName) {
      var containerName = self.getContainerFromWellField(fieldName);
      return Omniprotocol.utils.getContainerTypeFromName(self.protocol.parameters, containerName);
    };
    
    self.getContainerColorFromWellField = function (fieldName) {
      var containerName = self.getContainerFromWellField(fieldName);
      return self.getContainerColorFromContainerName(containerName);
    };

    //functions for fields with type container

    self.getContainerTypeFromFieldName = function (fieldName) {
      var containerName = self.getFieldValueByName(fieldName);
      return Omniprotocol.utils.getContainerTypeFromName(self.protocol.parameters, containerName);
    };

    self.getContainerColorFromContainerName = function (containerName) {
      var cont = Omniprotocol.utils.getContainerFromName(self.protocol.parameters, containerName);
      return _.result(cont, 'value.color');
    };

    self.getContainerColorFromFieldName = function (fieldName) {
      var containerName = self.getFieldValueByName(fieldName);
      return self.getContainerColorFromContainerName(containerName);
    };

    // RESOURCE - might be moot with server handling

    self.trustResource = function (url) {
      return $sce.trustAsResourceUrl(url);
    };

    self.getResourceUrl = function (resourceKey) {
      return 'upload/url_for?key=' + encodeURIComponent(resourceKey);
    };

    self.getResource = function (resourceKey) {
      return Communication.request( self.getResourceUrl(resourceKey) , 'get', {
        responseType : 'blob',
        headers : {
          'Accept' : 'image/jpeg',
          'Content-Type': 'image/jpeg'
        }
      })
        .success(function (data, headers) {
          console.log(data);

          //make this work!

          //expects a blob
          // encode data to base 64 url
          var fr = new FileReader();
          fr.onload = function(){
            // this variable holds your base64 image data URI (string)
            // use readAsBinary() or readAsBinaryString() below to obtain other data types
            console.log( fr.result );
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
