## Wet Lab Accelerator

To get it running you'll need to install (might need to sudo):

- node + npm: http://nodejs.org/
- grunt + bower: `npm install -g grunt-cli bower`
- install packages (run in this directory): `npm install && bower install`
- build + run the server: `npm run start`

### Release Notes

This version of Wet Lab Accelerator is for open-source release, running on a standalone server, using locally written files for persistence. The server and application will run independently through Docker, but an internet connection is required to verify and send protocols to Transcriptic.

You are free to view the source code and run the application, subject to the License, Autodesk Pre-Release Product Testing Agreement, and other relevant literature. The application is also currently freely available at `https://wla.bionano.autodesk.com`, but is not guaranteed to always be available at that domain.

The structure of files largely follows that which is prescribed by scaffolding framework Yeoman, and the Angular generator for that command line application. That said, because of application deadlines, the short lifetime of this application and limited maintenance following its inital demo, there are parts of the application in notably better health than others. For more information about the structure of the application, particularly if you wish to contribute to the codebase, please contact the Authors.

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

