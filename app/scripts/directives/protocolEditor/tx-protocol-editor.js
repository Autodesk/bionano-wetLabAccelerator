'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolEditor
 * @description
 * # txProtocolEditor
 */
  //todo - listen for parameters changing, propagate variable name throughout
angular.module('tx.protocolEditor')
  .directive('txProtocolEditor', function ($window, $rootScope, $timeout, DragDropManager, ProtocolHelper) {
    return {
      templateUrl     : 'views/tx-protocol-editor.html',
      restrict        : 'E',
      require         : 'form', //todo - register controllers of instruction with form
      scope           : {
        protocol: '='
      },
      bindToController: true,
      controllerAs    : 'editorCtrl',
      controller      : function ($scope, $element, $attrs) {
        var self = this;

        /*
        //ui-sortable options
        self.groupSortableOptions = {
          axis       : 'y',
          scroll     : true,
          handle     : '.protocol-group-header',
          containment: '.protocol-instructions',
          tolerance  : 'pointer'
        };
        */

        self.duplicateGroup = function (group) {
          var index = _.indexOf(self.protocol.groups, group);
          self.protocol.groups.splice(index, 0, _.clone(group, true));
        };

        self.deleteGroup = function (group) {
          _.remove(self.protocol.groups, group);
        };

        self.onFileDrop = function (files, event, rejected) {
          if ($window.FileReader) {

            var fileReader = new FileReader();

            fileReader.onload = function(e) {
              $scope.$apply(function() {
                try {
                  ProtocolHelper.assignCurrentProtocol(angular.fromJson(e.target.result));
                  $timeout(function () {
                    $rootScope.$broadcast('editor:newprotocol');
                  })
                } catch (e) {
                  console.log('couldnt parse dropped JSON', e);
                }
              });
            };

            fileReader.readAsText(files[0]);
          }
        };

        self.optsDroppableEditor = {
          greedy   : true,
          tolerance: 'pointer',
          drop     : function (e, ui) {
            console.log(e);
            var draggableTop = e.pageY,
                neighborTops = DragDropManager.getNeighborTops('tx-protocol-group', $element),
                dropIndex    = (_.takeWhile(neighborTops, function (neighborTop) {
                  return neighborTop < draggableTop;
                })).length;

            //assuming we only have groups and operations
            var group = (DragDropManager.type == 'operation') ?
              DragDropManager.groupFromOp(DragDropManager.model) :
              DragDropManager.model;

            //console.log(draggableTop, neighborTops, group, self.protocol);

            $scope.$apply(function () {
              DragDropManager.onDrop();
              self.protocol.groups.splice(dropIndex, 0, group);
              DragDropManager.clear();
            });
          }
        };
      },
      link            : function postLink (scope, element, attrs) {

      }
    };
  });
