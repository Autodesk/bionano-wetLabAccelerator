'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:FieldaliquotctrlCtrl
 * @description
 * # FieldaliquotctrlCtrl
 * Controller of the transcripticApp
 *
 * todo - can probably clean this up a lot using ProtocolHelper - containerType + containerName stuff is weird
 */
angular.module('transcripticApp')
  .controller('fieldAliquotCtrl', function ($scope, Omniprotocol, ProtocolHelper) {
    var self = this;

    self.handleAliquotSelection = function (wells) {
      //view guarantees that containerName is set given a change in wells (tx-plate)

      var mapped = _.map(wells, function (well) {
        return {
          container: self.containerName,
          well     : well
        };
      });

      if (self.singleContainer === false) {
        assignModel(_.union(
          _.reject(self.model, _.matches({container: self.containerName})),
          mapped
        ));
      } else {
        assignModel(mapped);
      }

      // todo - perf - check if triggers new digest
      self.wellsIn = wells;
    };

    self.init = function () {
      //hack - get fieldCtrl
      self.field = $scope.fieldCtrl.field;
      if (_.isUndefined(self.field.value)) {
        self.field.value = [];
      }
      self.model           = self.field.value;
      self.aliquotMultiple = (self.field.type != 'aliquot');

      //todo - handle single container in view
      self.singleContainer = _.result(self.field, 'singleContainer');

      var model           = self.model,
          multiple        = self.aliquotMultiple,
          singleContainer = self.singleContainer;

      // containerType will be handled by the directive, which knows about this mapping
      if (_.isArray(model) && model.length) {
        var firstContainer = _.result(_.first(model), 'container');
        self.containerName = firstContainer;
        setWellsInput(pruneWellsFromContainer(firstContainer));
      }

      $scope.$on('editor:parameterNameChange', function (event, oldName, newName) {
        //verify - may need to more explicitly make sure this runs after the $watch...
        _.forEach(self.model, function (wellObj) {
          if (wellObj.container == oldName) {
            wellObj.container = newName;
          }
        });
      });

      $scope.$watch('aliquotCtrl.containerName', function (newContainer) {
        //don't need to worry about setting wells here - change listener for wellsOut will handle whether dealing with single container
        setWellsInput(pruneWellsFromContainer(newContainer));
        getAndSetContainerColor();
      });

      //todo - perf - optimize - avoid unless actually this container
      $scope.$on('editor:parameterChange', function (e, newparams) {
        getAndSetContainerColor(newparams);
      });

      function getAndSetContainerColor (parameters) {
        parameters          = _.isUndefined(parameters) ? ProtocolHelper.currentProtocol.parameters : parameters;
        var cont            = Omniprotocol.utils.getContainerFromName(parameters, self.containerName);
        self.containerColor = _.result(cont, 'value.color');
      }
    };

    //so hack!
    //need to wait for tx-container-select to propagate type before setting input, because container will re-render and render selection empty
    function setWellsInput (wells) {
      var listener = $scope.$watch('aliquotCtrl.containerType', function (newval) {
        if (!!newval) {
          self.wellsIn = wells;
          listener();
        }
      });
    }

    function pruneWellsFromContainer (container) {
      //use model directly to avoid object reference weirdness + ensure everything actually in sync
      return _.pluck(_.filter(self.model, _.matches({container: container})), 'well');
    }

    function assignModel (wellObjs) {
      self.model.length = 0;
      _.forEach(wellObjs, function (wellObj) {
        self.model.push(wellObj);
      });
    }
  });
