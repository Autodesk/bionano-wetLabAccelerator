'use strict';

var utils           = require('./utils.js'),
    fromUtils       = require('./fromUtils.js'),
    fromConverters  = require('./fromConverters.js'),
    fromAbstraction = require('./fromAbstraction.js'),
    toUtils         = require('./toUtils.js'),
    toConverters    = require('./toConverters.js'),
    toAbstraction   = require('./toAbstraction.js'),
    omniprotocol    = require('omniprotocol'),
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