'use strict';

/**
 * @ngdoc function
 * @name transcripticApp.controller:FieldaliquotctrlCtrl
 * @description
 * # FieldaliquotctrlCtrl
 * Controller of the transcripticApp
 *
 * todo - can probably clean this up a lot using ProtocolHelper - containerType + containerName stuff is weird
 * //note - older code was meant to accomodate multiple containers. Should only allow for one container. paramId stuff works with this assumption, and updates all wellObjs to the new container name.
 */
angular.module('transcripticApp')
  .controller('fieldAliquotCtrl', function ($scope, Omniprotocol, ProtocolHelper, ProtocolUtils) {
    var self = this;

    self.handleAliquotSelection = function (wells, transpose) {
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

      self.wellsIn         = wells;
      self.field.transpose = transpose;
    };

    self.init = function () {
      //hack - get fieldCtrl
      self.field = $scope.fieldCtrl.field;
      if (_.isUndefined(self.field.value)) {
        self.field.value = [];
      }
      self.model = self.field.value;

      self.aliquotMultiple = (self.field.type != 'aliquot');

      //todo - handle single container in view (everything as single container)
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

      //in case container parameter id undefined, this will work if they haven't changed the name of the parameter
      if (_.isUndefined(self.field.paramId)) {
        var param            = ProtocolUtils.paramByName(self.containerName);
        self.field.paramId = _.result(param, 'id');
      }

      var relevantParam = ProtocolUtils.paramById(self.field.paramId),
          paramName = _.result(relevantParam, 'name');
      paramName && updateWellsContainerName(paramName);

      $scope.$on('editor:parameterNameChange', function (event, oldName, newName) {
        //note this will only get changes while directive is active
        updateWellsContainerName(newName, oldName);
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

    self.init();

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

    function updateWellsContainerName (newName, oldName) {
      _.forEach(self.model, function (wellObj) {
        if (_.isUndefined(oldName)) {
          wellObj.container = newName;
        } else if (wellObj.container == oldName) {
          wellObj.container = newName;
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
