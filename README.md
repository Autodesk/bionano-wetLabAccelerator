## ng-transcriptify

Angular Transcriptic UI

To get it running you'll need to install (might need to sudo):

- sass + compass: `gem update --system && gem install sass && gem install compass` 
- node + npm: http://nodejs.org/
- grunt + bower: `npm install -g grunt-cli bower`
- in this directory: `npm install && bower install`
- run the server: `grunt serve`

### TODO

- thermocycle
  - template clean up
  - ability to add steps

- json editor 
  - ability to drop in new JSON (requires filereader... not too hard though)
  - copy JSON like bootstrap docs (see https://github.com/blog/1365-a-more-transparent-clipboard-button)
  
- clean up dirty checks 
  - get tool for assessing perf?
  - tx-well when click JSON for protocol
  - tx-protocol when changing protocol

- tx-responseRequest - handle 404 error

#### Pretty + Nice features

- groups! ability to lump duplications

- add in notes for each container, reference, project, etc. (move away from select) 
  - arrow popover extensions
  
- better error messages
  - ngMessages for errors / warnings. in addition to just red boxes

- abstraction for project / container etc. lists so all update when changed

- updating tx-refs name -> update protocol references

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
