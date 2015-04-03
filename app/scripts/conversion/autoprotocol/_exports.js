'use strict';

var utils           = require('./utils.js'),
    converters      = require('./converters.js'),
    fromAbstraction = require('./fromAbstraction.js'),
    toAbstraction   = require('./toAbstraction.js'),
    //fixme - should reference the node package to guarantee added globally first
    omniprotocol    = global.omniprotocol,
    autoprotocol    = {};

autoprotocol.utils = utils;
autoprotocol.converters = converters;
autoprotocol.fromAbstraction = fromAbstraction;
autoprotocol.toAbstraction = toAbstraction;

//browserify will convert global to the window
global.omniprotocol.autoprotocol = autoprotocol;

//fixme - for some reason the module is only global, and not exported properly..
exports = autoprotocol;