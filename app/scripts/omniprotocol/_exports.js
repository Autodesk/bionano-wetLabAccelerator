'use strict';

var _ = require('lodash'),
    utils = require('./utils'),
    inputTypes = require('./inputTypes'),
    conv = require('./conv'),
    operations = require('./operations'),
    op = {};

op.utils = utils;
op.inputTypes = inputTypes;
op.conv = conv;
op.operations = operations;

//browserify will convert global to the window
global.omniprotocol = op;

//fixme - for some reason the module is only global, and not exported properly..
module.exports = op;