## Wet Lab Accelerator

To get it running you'll need to install (might need to sudo):

- node + npm: http://nodejs.org/
- grunt + bower: `npm install -g grunt-cli bower`
- in this directory: `npm install && bower install`
- run the server: `grunt serve`

### Release Notes

This version of Wet Lab Accelerator is for release as a zipped archive, released alongside its publication letter. 

You are free to view the source code and run the application, subject to the License, Autodesk Pre-Release Product Testing Agreement, and other relevant literature. Because we do not intend to maintain the application, we are hesitant to call it "Open Source." Accordingly, we are not hosting it on a service like GitHub, through we may do so in the future. The application is also currently freely available at `https://wla.bionano.autodesk.com`, is not guaranteed to be at any point in the future, in part because of the resources required to maintain its server etc. 

As such, this release has been partially rewritten to rely on localStorage, and does not require a server (beyond one for serving static files, which is provided by `grunt`). As such, it can largely be run without an internet connection (though you cannot communicate with Transcriptic to verify and run protocols without an internet connection).

The structure of files largely follows that which is prescribed by scaffolding framework Yeoman, and the Angular generator for that command line application. That said, because of application deadlines, the short lifetime of this application and limited maintenance following its inital demo, there are parts of the application in notably better health than others. 

For more information about the structure of the application, particularly if you wish to contribute to the codebase, please contact the Authors.