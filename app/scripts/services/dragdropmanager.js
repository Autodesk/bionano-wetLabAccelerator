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
 * @ngdoc service
 * @name wetLabAccelerator.DragDropManager
 * @description
 * # DragDropManager
 * Service in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator')
  .service('DragDropManager', function (Omniprotocol) {

    var self = this;

    this.groupFromOp = function (op) {
      return _.extend(Omniprotocol.utils.wrapOpInGroup(op), {
        name    : '',
        metadata: {
          description: ''
        }
      });
    };

    this.getNeighborTops = function getNeighborTops (selector, fromParent) {
      var neighbors = fromParent.find(selector);
      return _.map(neighbors, function (neighbor) {
        return $(neighbor).offset().top;
      });
    };

    this.groupFromModel = function () {
      return self.type == 'operation' ?
        self.groupFromOp(self.model) :
        self.model;
    };

    this.stepsFromModel = function () {
      return self.type == 'operation' ?
        [self.model] :
        self.model.steps;
    };

    this.clear = function () {
      self.type   = {};
      self.model  = {};
      self.onDrop = _.noop;
    };

    //init
    this.clear();

    return this;
  });
