var _                    = require('lodash');

/*******
 Operation Manipulation
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

//given wells in op specified by wellsKey (default 'wells) in form "container/well", removes 'container' from each
// and adds key `containerKey` (default 'object') with value extracted does not handle containers being different
// currently
function pluckOperationContainerFromWells (op, containerKey, wellsKey) {
  wellsKey     = _.isUndefined(wellsKey) ? 'wells' : wellsKey;
  containerKey = _.isUndefined(containerKey) ? 'object' : containerKey;

  var firstContainer = splitContainerWell(op[wellsKey][0]).container;

  //redo the wells
  var strippedWells = _.map(op[wellsKey], function (well) {
    return splitContainerWell(well).well;
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
  joinContainerWell : joinContainerWell,
  splitContainerWell: splitContainerWell,
  pluckOperationContainerFromWells : pluckOperationContainerFromWells
};