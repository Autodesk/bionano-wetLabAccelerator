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

var _ = require('lodash');

/*******
 Dimensionals
 *******/

var dimensionalSeparator = ":";

var dimensionalFields = ['duration', 'length', 'temperature', 'volume', 'speed', 'acceleration'];

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
// ignoreContainer is true
function flattenAliquots (abstAliquots, ignoreContainer) {
  var wellArray = _.result(abstAliquots, 'wells', []),
      containerName = _.result(abstAliquots, 'containerName');

  if (ignoreContainer === true) {
    return wellArray;
  } else {
    return _.map(wellArray, function (well) {
      return joinContainerWell(containerName, well);
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


module.exports = {
  dimensionalFields               : dimensionalFields,
  convertDimensionalToAuto        : convertDimensionalToAuto,
  convertDimensionalToOmni        : convertDimensionalToOmni,
  joinContainerWell               : joinContainerWell,
  splitContainerWell              : splitContainerWell,
  flattenAliquots                 : flattenAliquots,
  pluckOperationContainerFromWells: pluckOperationContainerFromWells
};