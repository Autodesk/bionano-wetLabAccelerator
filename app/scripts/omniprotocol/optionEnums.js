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