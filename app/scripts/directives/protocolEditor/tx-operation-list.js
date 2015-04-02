'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txGallery
 * @description
 * # txGallery
 * todo - better cloning behavior - see:
 * http://jsfiddle.net/3Ck4R/
 *
 // todo - need to differentiate between a group and an op
 // should be able to drop into either a group or an operation
 */
angular.module('tx.protocolEditor')
  .directive('txOperationList', function ($document, Omniprotocol) {
    return {
      templateUrl: 'views/tx-operation-list.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.operationKeys = getOperationKeys();

        var currentOpCancelled = false;

        scope.gallerySortableOptions = {
          scroll: true,
          connectWith: ".protocol-instructions",
          helper: function (e, el) {
            return el.clone().appendTo(document.body);
          },
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
                groupScaffold = opScaffold,
                // todo - should abstract stuff out of scaffold, and then fold in here
                // groupScaffold = Omniprotocol.utils.wrapOpInGroup(opScaffold),
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
