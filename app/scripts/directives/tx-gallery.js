'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 * # txGallery
 */
angular.module('transcripticApp')
  .directive('txGallery', function (Operations, AbstractionUtils) {
    return {
      templateUrl: 'views/tx-gallery.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.operationKeys = _.keys(Operations);

        var currentOpCancelled = false;

        scope.gallerySortableOptions = {
          scroll: true,
          connectWith: ".protocol-instructions",
          update: function (e, ui) {

            //debugger;

            if (ui.item.sortable.source[0] == ui.item.sortable.droptarget[0]) {
              currentOpCancelled = true;
              console.log('same list');
            }

            ui.item.sortable.cancel();

            //reset the list
            scope.operationKeys = _.keys(Operations);
          },
          stop: function (e, ui) {
            if (currentOpCancelled == true) {
              currentOpCancelled = false;
              return;
            }

            var opKey = ui.item.sortable.model,
                opScaffold = Operations[opKey],
                groupScaffold = AbstractionUtils.wrapOpInGroup(opScaffold),
                dropModel = ui.item.sortable.droptargetModel,
                dropIndex = ui.item.sortable.dropindex;

            dropModel.splice(dropIndex, 0, groupScaffold);
          }
        };
      }
    };
  });
