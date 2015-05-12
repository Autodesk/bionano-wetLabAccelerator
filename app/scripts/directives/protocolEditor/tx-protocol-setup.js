'use strict';

/**
 * @ngdoc directive
 * @name transcripticApp.directive:txProtocolSetup
 * @description
 * # txProtocolSetup
 */
angular.module('transcripticApp')
  .directive('txProtocolSetup', function ($rootScope, Auth, Container, Omniprotocol, ContainerHelper) {
    return {
      templateUrl     : 'views/tx-protocol-setup.html',
      restrict        : 'E',
      scope           : {
        parameters: '='
      },
      bindToController: true,
      controllerAs    : 'setupCtrl',
      controller      : function ($scope, $element, $attrs) {
        var self = this;

        this.paramTypes       = _(Omniprotocol.inputTypes).
          forEach(function (param, name) {
            _.assign(param, {name: name});
          }).
          filter(_.matches({canParameterize: true})).
          value();
        this.containerOptions = Omniprotocol.optionEnums.containers;
        this.storageOptions   = _.union([false], Omniprotocol.optionEnums.storage.storage);

        self.addParam = function (type) {
          self.parameters.push({type: type});
          $scope.showParameters = false;
        };

        self.addContainer = function () {
          self.parameters.push({
            type: 'container',
            value: {
              color: ContainerHelper.randomColor(),
              isNew : true
            }
          });
        };

        self.clearParamValue = function (param) {
          _.assign(param, {value: null});
        };

        self.deleteParam = function (param) {
          _.remove(self.parameters, param);
        };

        /* containers */

        //this is set dynamically, reference should never be broken
        self.remoteContainers = ContainerHelper.remote;

        self.handleChangeParamType = function (param) {
          self.clearParamValue(param);
          $scope.checkContainerChange();
        };

        self.handleSelectRemoteContainer = function (param, remote) {
          _.assign(param.value, remote);
          $scope.notifyContainerChange();
        };

      },
      link            : function postLink (scope, element, attrs) {
        var oldContainerLength;

        //CHANGE CHECKING / CONTAINERS

        scope.$watch('setupCtrl.parameters', function (newval, oldval) {
          $rootScope.$broadcast('editor:parameterChange', newval);
        }, true);

        scope.checkContainerChange = function () {
          var containerList = _.filter(scope.setupCtrl.parameters, {type: 'container'});
          if (containerList.length != oldContainerLength) {
            ContainerHelper.setLocal(containerList);
            scope.notifyContainerChange();
            oldContainerLength = containerList.length;
          }
        };

        //mostly for tx-container-select
        scope.notifyContainerChange = function () {
          $rootScope.$broadcast('editor:containerChange');
        };

        scope.$on('editor:newprotocol', scope.checkContainerChange);

        //VERIFICATIONS

        scope.$on('editor:verificationSuccess', function (event) {
          _.forEach(scope.setupCtrl.parameters, function (param) {
            delete param.verification;
          });
        });

        scope.receiveVerifications = function (vers) {
          //todo - need to show verification for whole setup
          _.forEach(vers, function (ver) {
            _.assign(_.find(scope.setupCtrl.parameters, {name: ver.container}), {verification: ver});
          });
        };

        scope.$watch('isCollapsed', function (newval) {
          element.toggleClass('open', newval);
        });

        //init
        scope.checkContainerChange();
      }
    };
  });
