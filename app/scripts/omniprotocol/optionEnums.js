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

//browserify doesn't like when you use folder as variable

var containers  = require('./optionEnums/containers.js'),
    dimensional = require('./optionEnums/dimensional.js'),
    dyes        = require('./optionEnums/dyes.js'),
    gel         = require('./optionEnums/gel.js'),
    lid         = require('./optionEnums/lid.js'),
    reagents    = require('./optionEnums/reagents.js'),
    storage     = require('./optionEnums/storage.js');

module.exports = {
  containers : containers,
  dimensional: dimensional,
  dyes       : dyes,
  gel        : gel,
  lid        : lid,
  reagents   : reagents,
  storage    : storage
};