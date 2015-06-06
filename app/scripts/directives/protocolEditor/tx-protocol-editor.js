'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolEditor
 * @description
 * # txProtocolEditor
 */
angular.module('tx.protocolEditor')
  .directive('txProtocolEditor', function ($window, $rootScope, $timeout, Notify, DragDropManager, ProtocolHelper, Omniprotocol) {
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

        self.duplicateGroup = function (group) {
          var index = _.indexOf(self.protocol.groups, group);
          self.protocol.groups.splice(index, 0, angular.copy(group));
        };

        self.deleteGroup = function (group) {
          _.remove(self.protocol.groups, group);
        };

        self.insertBeforeGroup = function (group, toInsert) {
          var index = _.indexOf(self.protocol.groups, group);
          self.protocol.groups.splice(index, 0, toInsert);
        };

        self.onFileDrop = function (files, event, rejected) {
          if ($window.FileReader) {

            var fileReader = new FileReader();
            var protocol;

            fileReader.onload = function (loadEvent) {
              try {
                protocol = angular.fromJson(loadEvent.target.result);
                $scope.$apply(function () {
                  ProtocolHelper.clearIdentifyingInfo(protocol);
                  ProtocolHelper.assignCurrentProtocol(protocol);
                });
              } catch (err) {
                console.log('couldnt parse dropped JSON', e);
              }
            };

            fileReader.readAsText(files[0]);
          }
        };

        self.allStepsOpen   = false;
        self.toggleAllSteps = function () {
          self.allStepsOpen = !self.allStepsOpen;
          $rootScope.$broadcast('editor:toggleGroupVisibility', self.allStepsOpen);
        };

        //todo - deprecate
        self.optsDroppableEditor = {
          drop: function (e, ui) {
            console.log('dropped on editor', e);
            var draggableTop = e.pageY,
                neighborTops = DragDropManager.getNeighborTops('tx-protocol-group', $element),
                dropIndex    = (_.takeWhile(neighborTops, function (neighborTop) {
                  return neighborTop < draggableTop;
                })).length;

            var group = DragDropManager.groupFromModel();

            //console.log(draggableTop, neighborTops, group, self.protocol);

            $scope.$apply(function () {
              DragDropManager.onDrop();
              self.protocol.groups.splice(dropIndex, 0, group);
              DragDropManager.clear();
            });
          }
        };

        self.optsDroppableSetup = {
          drop: function (e, ui) {
            $scope.$apply(function () {
              DragDropManager.onDrop();
              self.protocol.groups.unshift(DragDropManager.groupFromModel());
              DragDropManager.clear();
            });
          }
        };

        self.optsDroppableEditorBottom = {
          drop: function (e, ui) {
            $scope.$apply(function () {
              DragDropManager.onDrop();
              self.protocol.groups.push(DragDropManager.groupFromModel());
              DragDropManager.clear();
            });
          }
        }
      },
      link            : function postLink (scope, element, attrs) {

        scope.$on('editor:verificationSuccess', function () {
          $rootScope.$broadcast('editor:clearVerifications'); //just in case
          Notify({
            message: 'Protocol Valid!',
            error  : false
          });
        });

        scope.$on('editor:runSubmitted', function () {
          Notify({
            message: 'Protocol successfully submitted to Transcriptic.',
            error  : false
          });
        });

        //verifications come in the form { message : '', $index { step, group, loop, unfolded }, field: {}, fieldName : '' }
        //exception, $index may be 'parameters' and apply to aprameters, not operation
        scope.$on('editor:verificationFailureLocal', function (event, localVer) {

          Notify({
            message: 'Conversion prevented due to errors, highlighted below',
            error  : true
          });

          var instructions = _(localVer).
            filter(function (ver) {
              return ver.$index != 'parameter';
            }).
            map(function (ver, verIndex) {
              console.log(ver);

              return _.assign({}, {
                message : ver.message,
                source  : 'local',
                target  : 'field',
                indices : ver.$index,
                original: ver
              });
            }).
            tap(handleMassagedOpVerifications).
            value();

          var refs = _(localVer).
            filter(function (ver) {
              return ver.$index == 'parameter';
            }).
            map(function (ver, verIndex) {
              console.log(ver);

              return _.assign({}, {
                message  : ver.message,
                source   : 'local',
                target   : 'parameter',
                container: ver.fieldName,
                original : ver
              });
            }).
            tap(handleMassagedParamVerifications).
            value();

        });

        scope.$on('editor:verificationFailure', function (event, verifications) {

          Notify({
            message: 'Verification resulted in ' + verifications.length + ' errors, highlighted below',
            error  : true
          });

          //verifications come in the form { message : '', context : { instruction : # } } }
          //we add indicies in form {group : #, step: #, loop : #, folded : #, unfolded : # } where unfolded matches instruction

          var instructions = _(verifications).
            filter(function (ver) {
              return _.has(ver, 'context.instruction');
            }).
            map(function (ver, verIndex) {
              var targetInstruction = _.result(ver, 'context.instruction', -1);
              return _.assign({}, {
                indices: Omniprotocol.utils.getFoldedStepInfo(scope.editorCtrl.protocol, targetInstruction)
              }, {
                message : ver.message,
                source  : 'transcriptic',
                target  : 'group', //todo - should be operation
                original: ver
              });
            }).
            tap(handleMassagedOpVerifications).
            value();

          var refs = _(verifications).
            filter(function (ver) {
              return _.has(ver, 'context.ref');
            }).
            map(function (ver, verIndex) {
              return {
                message  : ver.message,
                source   : 'transcriptic',
                target   : 'parameter',
                container: _.result(ver, 'context.ref'),
                original : ver
              };
            }).
            tap(handleMassagedParamVerifications).
            value();
        });

        function handleMassagedOpVerifications (verifications) {
          return _(verifications).
            filter(function (ver) {
              return _.result(ver, 'indices.loop', -1) == 0;
            }).
            uniq(false, function (ver) {
              //filter out duplicate messages for the same instruction
              return ver.indices.unfolded + ':' + ver.message;
            }).
            forEach(function (ver) {
              var foldedIndex = ver.indices.folded,
                  groupIndex  = ver.indices.group,
                  stepIndex   = ver.indices.step,
                  $groupEl    = element.find('tx-protocol-group')[groupIndex],
                  $el         = angular.element($groupEl).find('tx-protocol-op')[stepIndex];

              //todo - merge different messages for same instruction
              //(e.g. try bad dispense, get two errors - one for range, one increments)

              //hack - calling function by querying the DOM is not so great...
              //should probably just use another $broadcast, but then each op needs to know its indices (dynamically recalculated each change...)
              //note - function inside tx-protocol-op link
              angular.element($el).children().scope().receiveVerification(ver);
            }).
            value();
        }

        function handleMassagedParamVerifications (verifications) {
          //todo - merge for same container?
          element.find('tx-protocol-setup').children().scope().receiveVerifications(verifications);
        }

      }
    };
  });
