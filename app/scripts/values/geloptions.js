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
 * @name wetLabAccelerator.GelOptions
 * @description
 * # GelOptions
 * Constant in the wetLabAccelerator.
 */
angular.module('wetLabAccelerator').constant('GelOptions', {
  matrix: ["agarose(96,2.0%)", "agarose(48,4.0%)", "agarose(48,2.0%)", "agarose(12,1.2%)", "agarose(8,0.8%)"],
  ladder: ["ladder1", "ladder2"]
});
