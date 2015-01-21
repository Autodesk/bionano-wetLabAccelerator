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
  
- abstraction for project / container etc. lists so all update when changed, also meta + non-comm methods

- updating tx-refs name -> update protocol references

- basic data visualizations

- container provisioning, esp reservations

#### Performance

- tx-protocol
 - use ng-if for json-editor (require proto inheritance model to propagate properly?)
- tx-well
  - lots of checks (e.g. when click JSON for protocol)
- tx-wellplate  
  - move to map internally? skip indexOf?

#### Pretty + Nice features

- groups! ability to lump duplications

- json editor
  - copy JSON like bootstrap docs (see https://github.com/blog/1365-a-more-transparent-clipboard-button)

- add in notes for each container, reference, project, etc. (move away from select) 
  - arrow popover extensions
  - container capabilities
  
- update gel_separate & sangerseq well format pending Tali response
  
- better error messages
  - ngMessages for errors / warnings. in addition to just red boxes

- refactor tx-measure
  - need to support input[type] + ideally other input attributes
  - maybe as attribute directive? but need dropdown or something
  - allow passage of object as attrs for input?

- smart checks for covers, seals, etc.

- UI for making aliquots?

- move away from selects to some other dropdown?

- upgrade to angular 1.4 (longer-term) ??

- google analytics


#### JS Autoprotcol

- kinda separate from UI... ability to create steps programmatically

- look into Haxe, migrating Autoprotocol into it
