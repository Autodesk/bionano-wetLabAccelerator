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
 * @ngdoc directive
 * @name wetLabAccelerator.directive:txGallery
 * @description
 * # txGallery
 * todo - better cloning behavior - see:
 * need cloning so that step appears on top, or need to put operations after the editable steps in the html (z index wasn't doing it)
 * http://jsfiddle.net/3Ck4R/
 *
 // todo - need to differentiate between a group and an op
 // should be able to drop into either a group or an operation
 */
angular.module('tx.protocolEditor')
  .directive('txOperationList', function ($document, $window, DragDropManager, Omniprotocol) {
    return {
      templateUrl: 'views/tx-operation-list.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.operations = _.values(Omniprotocol.operations);

        /*
        var currentOpCancelled = false;
        scope.sortableOptions = {
          scroll: true,
          helper: 'clone',
          appendTo: document.body, // this crashes chrome with ui-sortable???
          items: ".drag-handle",
          //connectWith: ".protocol-instructions",
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
                opScaffold = _.clone(opInfo.scaffold, true),
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
          return _.clone(initalKeys);
        }
        */

        scope.draggableOptions = {
          helper: function () {
            var helper = $(this).clone();
            helper.addClass('active');
            return helper;
          },
          appendTo: document.body,
          scroll: true,
          start: function (e, ui) {
            //angular.element(ui.helper).addClass('operation-list-item active');

            var opKey = angular.element(e.target).scope().op.operation,
                opScaffold = Omniprotocol.utils.scaffoldOperationWithValues(opKey);

            _.assign(DragDropManager, {
              type : 'operation',
              model : opScaffold,
              onDrop: _.noop
            });
          }
        };
      }
    };
  });
