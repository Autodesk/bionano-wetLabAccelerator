var fs       = require('fs');
var _        = require('lodash');
var op       = require('./app/scripts/omniprotocol/_exports.js');
var filePath = 'wla-all.json';

console.log('\n\n\n\n\n\n\n\n\n\n\n\n');

var fileContents = fs.readFileSync(filePath, 'utf8');
var db           = JSON.parse(fileContents);

var idMap = {
  '24': '10206001195804600', //max
  '26': '10206001195804600', //max
  '31': '10204426606725315', //aaron fb
  '36': '10206450034788087' //cesar
};

var tokenMap = {
  '24': 'bfe488a2-fd5a-48f1-9514-c49a7d74fdac',
  '26': '1d9d2284-2b98-4606-852e-dcf4491fc52b',
  '31': '1c3518b1-f999-49f3-bfe0-538f75a9b4f7',
  '36': '043954d4-e413-4334-ab26-15ab99312136'
};

var protocols  = {},
    runs       = {},
    projectMap = {};

_.forEach(db, function (projects, uid) {

  //only have projects that have a type, i.e. have been made in the app
  var filteredProjects = _(projects)
    .pick(function (proj) {
      return _.result(proj, 'project', false);
    })
    .mapValues(function (obj, id) {
      return JSON.parse(_.result(obj, 'project', {}));
    })
    .pick(function (project, id) {
      return _.result(project, 'metadata.type', false);
    })
    .forEach(function (project, id) {
      _.set(project, 'metadata.author', {
        id: uid
      });
    })
    .value();

  var userProtocols = _(filteredProjects)
    .pick(function (project) {
      return _.result(project, 'metadata.type') == 'protocol';
    })
    .pick(function (project) {
      return _.result(project, 'groups', []).length > 0;
    })
    .mapValues(updateProtocol)
    .value();


  var userRuns = _(filteredProjects)
    .pick(function (project) {
      return _.result(project, 'metadata.type') == 'run';
    })
    .mapValues(updateRun)
    .forEach(function (project, id) {
      _.set(project, 'protocol.metadata.author', {
        id: uid
      });
      _.set(project, 'metadata.protocol.author', {
        id: uid
      });
    })
    .value();


  if (_.has(idMap, uid)) {
    _.assign(runs, userRuns);
    _.assign(protocols, userProtocols);
    _.set(projectMap, uid, _.assign({}, userRuns, userProtocols))
  }
});

var projects = _.assign({}, runs, protocols);

console.log(_.keys(projects).length);

fs.writeFileSync('wla-transformed.json', JSON.stringify(projects, null, 2));

_.forEach(_.keys(projectMap), function (uid) {
  fs.writeFileSync('wla-transformed-' + uid + '.json', JSON.stringify(projectMap[uid], null, 2));
});


//todo - write to file
//todo - ensure IDs mapped properly

function updateProtocol (protocol) {

  //give parameters ids
  var parameterMap = {};

  _.forEach(protocol.parameters, function (param) {
    param.id                 = uuidGen();
    parameterMap[param.name] = {
      name : param.name,
      id   : param.id,
      type : param.type,
      value: param.value
    };
  });

  //basic field transformations
  op.utils.transformAllFields(protocol, function (field, step, group) {

    // BASIC TRANSFORMATIONS

    if (step.operation == 'dispense_resource') {
      step.operation = 'provision';
    }

    //convert flowrate to speed (mixwrap handled automatically)
    if (field.type == 'flowrate') {
      field.type = 'speed';
    }

    //convert aliquot+ to aliquot++ where appropriate
    if (field.type == 'aliquot+') {
      delete field.singleContainer;
      var opName        = step.operation;
      var scaffoldField = op.utils.pluckField(op.operations[opName].scaffold.fields, field.name);
      field.type        = scaffoldField.type;
    }

    // PARAMETER HANDLING

    if (field.parameter) {
      var paramNameOld = field.parameter,
          param        = parameterMap[paramNameOld];

      //use parameter id
      field.parameter = param.id;

      //assign parameter value
      field.value = param.value;
    }

    //convert format of containers + assign ID + containerName
    else if (field.type == 'container') {
      var containerName = _.result(field, 'value'),
          param         = _.result(parameterMap, containerName);

      //handles undefined
      field.value = {
        container    : _.result(param, 'id'),
        containerName: _.result(param, 'name')
      };
    }

    //convert format of aliquots + assign ID + containerName
    else if (_.startsWith(field.type, 'aliquot')) {
      //asumes everything is a single container
      var containerName = _.result(_.first(_.result(field, 'value', [])), 'container'),
          wells         = _.pluck(field.value, 'well'),
          param         = _.result(parameterMap, containerName);

      field.value = {
        container    : _.result(param, 'id'),
        containerName: _.result(param, 'name'),
        wells        : wells
      };
    }
  });

  //set protocol version
  _.set(protocol, 'metadata.version', '1.0.0');

  return protocol;
}

function updateRun (run) {
  //check for relevant protocol and use updated version

  var protocolId     = _.result(run, 'protocol.metadata.id'),
      runIdField     = 'transcripticRunId',
      projectIdField = 'transcripticProjectId',
      txRunId        = _.result(run, runIdField),
      txProjectId    = _.result(run, projectIdField);

  if (!_.has(protocols, protocolId)) {
    var newId    = uuidGen();
    run.protocol = updateProtocol(run.protocol);
    _.set(run, 'metadata.protocol.id', newId);

    run.protocol.metadata = _.assign({}, {
      date     : '' + (new Date()).valueOf(),
      type     : 'protocol',
      author   : {},
      "tags"   : [],
      "db"     : {},
      "version": "1.0.0"
    }, run.protocol.metadata);

    _.set(run, 'protocol.metadata.id', newId);
  } else {
    run.protocol = _.result(protocols, protocolId);
  }

  delete run[projectIdField];
  delete run[runIdField];

  _.set(run, 'metadata.' + runIdField, txRunId);
  _.set(run, 'metadata.' + projectIdField, txProjectId);

  _.set(run, 'metadata.version', "1.0.0");

  return run;
}


// helpers

function uuidGen () {
  var d    = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d     = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}