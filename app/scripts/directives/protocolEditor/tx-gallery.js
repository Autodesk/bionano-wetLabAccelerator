'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 * # txGallery
 * todo - better cloning behavior - see:
 * http://jsfiddle.net/3Ck4R/
 */
angular.module('tx.protocolEditor')
  .directive('txGallery', function ($document, Omniprotocol) {
    return {
      templateUrl: 'views/tx-gallery.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.operationKeys = getOperationKeys();

        var currentOpCancelled = false;

        scope.gallerySortableOptions = {
          scroll: true,
          helper: function (e, el) {
            console.log(el);
            return el.clone().appendTo(document.body);
          },
          connectWith: ".protocol-instructions",
          update: function (e, ui) {

            //same list
            if (!ui.item.sortable.droptargetModel ||
                 ui.item.sortable.sourceModel == ui.item.sortable.droptargetModel) {
              currentOpCancelled = true;
            }

            //cancel always and we'll update the model ourselves
            // (prevent double insertion via splice)
            ui.item.sortable.cancel();

            //reset the operation list
            scope.operationKeys = getOperationKeys();
          },
          stop: function (e, ui) {
            if (currentOpCancelled == true) {
              currentOpCancelled = false;
              return;
            }

            var opKey = ui.item.sortable.model,
                opScaffold = Omniprotocol.operations[opKey].scaffold,
                groupScaffold = Omniprotocol.utils.wrapOpInGroup(opScaffold),
                dropModel = ui.item.sortable.droptargetModel,
                dropIndex = ui.item.sortable.dropindex;

            !!dropModel && dropModel.splice(dropIndex, 0, groupScaffold);
          }
        };

        function getOperationKeys () {
          return _.keys(Omniprotocol.operations);
        }
      }
    };
  });
