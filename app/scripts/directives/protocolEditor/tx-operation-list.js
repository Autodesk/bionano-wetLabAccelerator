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
        scope.operations = Omniprotocol.operations;
        scope.operationKeys = getOperationKeys();

        var currentOpCancelled = false;

        scope.gallerySortableOptions = {
          scroll: true,
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
          },
          stop: function (e, ui) {
            //reset the operation list
            scope.operationKeys = getOperationKeys();

            console.log(scope.operationKeys,  ui.item.sortable.sourceModel);
            _.forEach(scope.operationKeys, function (key, ind) {
              if (key != ui.item.sortable.sourceModel[ind]) {
                console.log(ind, key, scope.operationKeys, ui.item.sortable.sourceModel);
                return false;
              }
            });

            if (currentOpCancelled == true) {
              currentOpCancelled = false;
              return;
            }

            var opKey = ui.item.sortable.model,
                opInfo = Omniprotocol.operations[opKey],
                opScaffold = opInfo.scaffold,
                groupScaffold = _.extend(Omniprotocol.utils.wrapOpInGroup(opScaffold), {
                  name : opInfo.name,
                  metadata : {
                    description: opInfo.description
                  }
                }),
                dropModel = ui.item.sortable.droptargetModel,
                dropIndex = ui.item.sortable.dropindex;

            _.isArray(dropModel) && dropModel.splice(dropIndex, 0, groupScaffold);
          }
        };

        var initalKeys;
        function getOperationKeys () {
          _.isUndefined(initalKeys) && (initalKeys = _.keys(Omniprotocol.operations));
          return initalKeys;
        }
      }
    };
  });
