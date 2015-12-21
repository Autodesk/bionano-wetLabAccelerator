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

var utils           = require('./utils.js'),
    fromUtils       = require('./fromUtils.js'),
    fromConverters  = require('./fromConverters.js'),
    fromAbstraction = require('./fromAbstraction.js'),
    toUtils         = require('./toUtils.js'),
    toConverters    = require('./toConverters.js'),
    toAbstraction   = require('./toAbstraction.js'),
    //fixme - should reference the node package to guarantee added globally first (once exporting properly)
    omniprotocol    = global.omniprotocol,
    autoprotocol    = {};

autoprotocol.utils           = utils;
autoprotocol.fromUtils       = fromUtils;
autoprotocol.fromConverters  = fromConverters;
autoprotocol.fromAbstraction = fromAbstraction;
autoprotocol.toUtils         = toUtils;
autoprotocol.toConverters    = toConverters;
autoprotocol.toAbstraction   = toAbstraction;

//browserify will convert global to the window
global.omniprotocol.autoprotocol = autoprotocol;

//fixme - for some reason the module is only global, and not exported properly..
exports = autoprotocol;