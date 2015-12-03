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
 * @name wetLabAccelerator.OligoOptions
 * @description
 * # OligoOptions
 * Constant in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator').constant('OligoOptions', {
  scale : [
    {"value": 25, "unit": "nanomole"},
    {"value": 50, "unit": "nanomole"},
    {"value": 200, "unit": "nanomole"},
    {"value": 1, "unit": "micromole"},
    {"value": 10, "unit": "micromole"}
  ],
  purity: ["desalt", "hplc", "page"]
});
