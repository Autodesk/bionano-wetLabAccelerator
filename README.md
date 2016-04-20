[![Docker Repository on Quay](https://quay.io/repository/autodesk/bionano-wetlabaccelerator/status "Docker Repository on Quay")](https://quay.io/repository/autodesk/bionano-wetlabaccelerator)
## Wet Lab Accelerator

Wet Lab Accelerator is a tool for researchers working in synthetic biology and virology, allowing users to design robotic wet lab protocols using a visual UI — no coding or scripting required. Users can create a protocol from scratch, or use a template experiment provided. Set up each step of a protocol using graphical visualizations of wet lab containers, and interact with results through dynamic visualizations. Often-used settings can be parameterized to ease running of variations on the same protocol.

When you are ready to run your protocol, Wet Lab Accelerator generates the vendor-specific code and verifies it. Any issues are clearly highlighted so you can quickly find and correct them. Wet Lab Accelerator is seamlessly integrated with Transcriptic, our first automation partner.

### Installation

To get it running you'll need to install (might need to sudo):

- node + npm: http://nodejs.org/
- grunt + bower: `npm install -g grunt-cli bower`
- install packages (run in this directory): `npm install && bower install`
- build + run the server: `npm run start`

### Release Notes

This version of Wet Lab Accelerator runs on a standalone server, using locally written files for persistence. The server and application will run independently through Docker, but an internet connection is required to verify and send protocols to Transcriptic. The application is currently freely available at [wla.bionano.autodesk.com](https://wla.bionano.autodesk.com), but is not guaranteed to always be available at that domain.

#### Code Base

Wet Lab Accelerator is primarily a front-end web application, written in javascript primarily using web application framework [AngularJS](https://angularjs.org/), with graphical components written using [D3.js](http://d3js.org/).

Stylesheets are written in [SCSS](http://sass-lang.com/).

The server is written in Javascript using [Node](https://nodejs.org/en/) and [Express](http://expressjs.com/en/index.html), and is very simple, largely responsible for just serving static files, and persisting user data as files. Note that list of files is flat, and will be shared across all users of an instance, but could be trivially extended to support multiple users through a basic authentication mechanism.

Packages are installed using managers [bower](http://bower.io/) and [npm](https://www.npmjs.com/).

#### Structure

The structure of files largely follows that which is prescribed by scaffolding framework Yeoman, and the [Angular generator](https://github.com/yeoman/generator-angular#readme) for that command line application. 

There are parts of the application in notably better health than others. For more information about the structure of the application, particularly if you wish to contribute to the codebase, please contact the Authors.

### Contact

To contact the authors, please email: maintainers.bionano-webLabAccelerator@autodesk.com

### License

Copyright 2015 Autodesk Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

#### Usage agreement
     
You are free to view the source code and run the application, subject to the License, Autodesk Pre-Release Product Testing Agreement, and other relevant literature.
