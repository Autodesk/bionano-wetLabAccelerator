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

function ConversionError(message, fieldObj, fieldName, indices) {
    this.name = 'ConversionError';
    this.message = message || 'Default Message';
    this.field = fieldObj;
    this.fieldName = fieldName;
    this.$index = indices;
}
ConversionError.prototype = Object.create(Error.prototype);
ConversionError.prototype.constructor = ConversionError;

global.ConversionError = ConversionError;

var _ = require('lodash'),
    optionEnums = require('./optionEnums.js'),
    inputTypes = require('./inputTypes.js'),
    utils = require('./utils.js'),
    conv = require('./conv.js'),
    operations = require('./operations.js'),
    op = {};

op.utils = utils;
op.inputTypes = inputTypes;
op.conv = conv;
op.operations = operations;
op.optionEnums = optionEnums;

//browserify will convert global to the window
global.omniprotocol = op;

//fixme - for some reason the module is only global, and not exported properly.. maybe it's browserify
module.exports = op;