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
  - ability to add to pipette, thermocycle templates
  - scaffolds for each instruction as defaults????
  
- thermocycle template

- directive for response to order / run
  - abstract so can pass in strings dep on type
  - link to transcriptic page
  - ability to toggle rest of alert by clicking corner

- json editor - have a save so that model doesn't reposition cursor, but need to validate

- ngMessages support

- upgrade to angular 1.4 (longer-term) ??

#### Pretty + Nice features

- abstraction for project / container etc. lists so all update when changed

- simlpe-sticky jank on element resizing

- refactor tx-measure
  - need to support input[type] + ideally other input attributes
  - maybe as attribute directive? but need dropdown or something
  - allow passage of object as attrs for input?

- better well UI

- smart checks for covers, seals, etc.

- ability to drop in new JSON 
- copy JSON like bootstrap

- UI for making aliquots?

- move away from selects to some other dropdown?

- add in notes / catches etc., 
  - ngMessages for errors / warnings. 
  - Better required / optional markers

- google analytics


#### JS Autoprotcol

- kinda separate from UI... ability to create steps programmatically

- look into Haxe, migrating Autoprotocol into it
