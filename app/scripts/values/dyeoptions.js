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
 * @name wetLabAccelerator.dyeOptions
 * @description
 * # dyeOptions
 * Constant in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator').constant('DyeOptions', {
  "channel1" : ["FAM","SYBR"],
  "channel2" : ["VIC","HEX","TET","CALGOLD540"],
  "channel3" : ["ROX","TXR","CALRED610"],
  "channel4" : ["CY5","QUASAR670"],
  "channel5" : ["QUASAR705"]
});
