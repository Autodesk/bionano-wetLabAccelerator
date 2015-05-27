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