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

var path       = require('path');
var fs         = require('fs');
var https      = require('https');
var http       = require('http');
var express    = require('express');
var bodyParser = require("body-parser");
var bunyan     = require('bunyan');
var log        = bunyan.createLogger({name: 'wetlab'});
var _          = require('lodash');

var PLATFORM_URL = 'platform.bionano.autodesk.com';
var PORT         = parseInt(process.env.PORT) || 8000;
var appFolder    = (process.env.APP || path.dirname(__dirname)) + '/dist';
var filesFolder  = path.dirname(__dirname) + '/files';
var HOST         = process.env.HTTP_HOST || "http://localhost:" + PORT;
var LOCAL        = process.env.LOCAL || false; //Local serving

log.info({
  LOCAL            : LOCAL,
  port             : PORT,
  appFolder        : appFolder,
  'process.env.APP': process.env.APP
});

/* Create the app */
var app = express();

app.use(require('express-bunyan-logger').errorLogger());

if (LOCAL !== false) {
  app.use(express.static(path.dirname(__dirname) + '/.tmp'));
  app.use('/bower_components', express.static(path.dirname(__dirname) + '/bower_components'));
  app.use(express.static(path.dirname(__dirname) + '/app'));
} else {
  //Serve static content
  app.use(express.static(appFolder));
}

var jsonParser = bodyParser.json({
  limit: (1024 * 1024 * 5)
});

function makeFilePath (file) {
  return filesFolder + '/' + file;
}

app.get('/', function(req, res) {
  res.render('index');
  res.sendfile(appFolder + '/index.html');
});

//get all the projects (may be slow)
app.get('/files', function(req, res) {
  var toPluck = req.query.pluck;

  fs.readdir(filesFolder, function(err, files) {
    if (err) {
      log.error(err);
    }

    Promise.all(files.map(function(file) {
      return new Promise(function(resolve, reject) {
        var filePath = makeFilePath(file);
        fs.readFile(filePath, 'utf8', function(err, data) {
          if (err) {
            log.error(err);
            reject(err);
          }
          try {
            var parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(new Error('invalid JSON for ' + file))
          }
        });
      });
    })).then(function(files) {
      if (toPluck) {
        return files.map(function(file) {
          return _.result(file, toPluck);
        });
      } else {
        return files;
      }
    }).then(function(files) {
      res.json(files);
    }).catch(function(err) {
      log.error(err);
    })
  });
});

//get a project
app.get('/file/:id', function(req, res) {
  var id = req.params.id;

  fs.readFile(makeFilePath(id + '.json'), 'utf8', function (err, data) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(data);
    }
  });
});

//save a project
app.post('/file/:id', jsonParser, function(req, res) {
  var id      = req.params.id;
  var payload = req.body;

  var stringified;
  try {
    stringified = JSON.stringify(payload, null, 2);gi
  } catch (e) {
    res.status(402).send('invalid json');
    return;
  }

  fs.writeFile(makeFilePath(id + '.json'), stringified, function(err, data) {
    if (err) {
      res.status(402).send(err);
    } else {
      res.json(payload);
    }
  });
});

//delete a project
app.delete('/file/:id', function(req, res) {
  var id = req.params.id;
  fs.unlink(makeFilePath(id + '.json'), function(err) {
    if (err) {
      res.status(500).send('error deleting');
    } else {
      res.status(200).send();
    }
  })
});


var server = app.listen(PORT, '0.0.0.0', function() {
  var host = server.address().address;
  log.info('Listening at http://localhost:%s', PORT);
});

process.on('SIGINT', function() {
  log.warn("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  server.close();
  process.exit(0);
});


