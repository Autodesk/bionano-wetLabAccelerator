var _ = require('lodash');

/*******
 Dimensionals
 *******/

var dimensionalSeparator = ":";

var dimensionalFields = ['duration', 'length', 'temperature', 'volume', 'flowrate', 'acceleration'];

function convertDimensionalToAuto (omniDim) {
  return omniDim.value + dimensionalSeparator + omniDim.unit;
}

function convertDimensionalToOmni (val) {
  if (!_.isString(val)) {
    return null;
  }
  var split = val.split(dimensionalSeparator);
  return {
    value: parseInt(split[0], 10),
    unit : split[1]
  };
}

/*******
 Containers + Wells
 *******/

var containerWellDelimiter = "/";

function joinContainerWell (container, well, tempDelimiter) {
  return '' + container + (_.isString(tempDelimiter) ? tempDelimiter : containerWellDelimiter) + well;
}

//given a string in form "container/well", returns object in form { container : '<container>', well: '<well>' }
function splitContainerWell (containerWell) {
  if (!_.isString(containerWell)) {
    return null;
  }
  var split = containerWell.split(containerWellDelimiter);
  return {
    container: split[0],
    well     : split[1]
  };
}

//given array of objects with keys container + well, create array of strings in format "container/well", or "well" if
// ignoreContainer is truthy
function flattenAliquots (abstAliquots, ignoreContainer) {
  if (!!ignoreContainer) {
    return _.map(abstAliquots, _.partial(_.result, _, 'well'));
  } else {
    return _.map(abstAliquots, function (aliquot) {
      return joinContainerWell(aliquot.container, aliquot.well);
    });
  }
}

//given wells in op specified by wellsKey (default 'wells) in form "container/well", removes 'container' from each
// and adds key `containerKey` (default 'object') with value extracted does not handle containers being different
// currently
function pluckOperationContainerFromWells (op, containerKey, wellsKey) {
  wellsKey     = _.isUndefined(wellsKey) ? 'wells' : wellsKey;
  containerKey = _.isUndefined(containerKey) ? 'object' : containerKey;

  var firstContainer = splitContainerWell(op[wellsKey][0]).container;

  //redo the wells
  var strippedWells = _.map(op[wellsKey], function (well) {
    return _.result(splitContainerWell(well), 'well');
  });

  //need to set key dynamically
  var obj           = {};
  obj[containerKey] = firstContainer;
  obj[wellsKey]     = strippedWells;

  return _.assign({}, op, obj)
}

// deprecate-d
// type is "wells" or "container", fieldName is field with value
function createTransform (type, fieldName) {
  var validTypes = ['wells', 'container'];

  if (!_.includes(validTypes, type)) {
    throw new Error("invalid transform type")
  }

  var obj   = {};
  obj[type] = fieldName;
  return obj;
}

module.exports = {
  dimensionalFields               : dimensionalFields,
  convertDimensionalToAuto        : convertDimensionalToAuto,
  convertDimensionalToOmni        : convertDimensionalToOmni,
  joinContainerWell               : joinContainerWell,
  splitContainerWell              : splitContainerWell,
  flattenAliquots                 : flattenAliquots,
  pluckOperationContainerFromWells: pluckOperationContainerFromWells
};