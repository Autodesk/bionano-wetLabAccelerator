## ng-transcriptify

Angular Transcriptic UI

To get it running you'll need to install (might need to sudo):

- sass + compass: `gem update --system && gem install sass && gem install compass` 
- node + npm: http://nodejs.org/
- grunt + bower: `npm install -g grunt-cli bower`
- in this directory: `npm install && bower install`
- run the server: `grunt serve`

### TODO

- adding instructions
  - ability to add thermocycle templates
  - scaffolds for each instruction as defaults?
  
- thermocycle template clean up

- json editor 
  - have a save so that model doesn't reposition cursor, but still validate each key
  - ability to drop in new JSON (requires filereader... not too hard though)
  - copy JSON like bootstrap docs (see https://github.com/blog/1365-a-more-transparent-clipboard-button)
  
- clean up dirty checks 
  - get tool for assessing perf?
  - tx-well when click JSON for protocol
  - tx-protocol when changing protocl

#### Pretty + Nice features

- add in notes / catches etc.
  - ngMessages for errors / warnings. in addition to just red boxes

- abstraction for project / container etc. lists so all update when changed

- simlpe-sticky jank on element resizing / ability to pin to another element

- refactor tx-measure
  - need to support input[type] + ideally other input attributes
  - maybe as attribute directive? but need dropdown or something
  - allow passage of object as attrs for input?

- better well UI

- smart checks for covers, seals, etc.

- UI for making aliquots?

- move away from selects to some other dropdown?

- upgrade to angular 1.4 (longer-term) ??

- google analytics


#### JS Autoprotcol

- kinda separate from UI... ability to create steps programmatically

- look into Haxe, migrating Autoprotocol into it
