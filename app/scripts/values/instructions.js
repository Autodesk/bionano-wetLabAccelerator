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

'use strict';

//note - deprecated. use operations service instead

/**
 * @ngdoc service
 * @name wetLabAccelerator.instructions
 * @description
 * Enumeration of possible instructions, with minimal schema also provided.
 * todo - descriptiondata
 *    description, etc. for a popover?
 *    requirements (e.g. sealed)
 */
angular.module('wetLabAccelerator').constant('InstructionOptions', {
  //pipetting
  "pipette" : {
    scaffold: {
      op: "pipette",
      groups: []
    },
    description: {}
  },

  "dispense" : {
    scaffold: {
      op: "dispense"
    },
    description: {}
  },

  "thermocycle": {
    scaffold: {
      op: "thermocycle",
      groups: []
    },
    description: {}
  },

  //cover / seal
  "seal": {
    scaffold: {
      op: "seal"
    },
    description: {}
  },
  "unseal": {
    scaffold: {
      op: "unseal"
    },
    description: {}
  },
  "cover": {
    scaffold: {
      op: "cover"
    },
    description: {}
  },
  "uncover": {
    scaffold: {
      op: "uncover"
    },
    description: {}
  },

  //spectrometry
  "absorbance" : {
    scaffold: {
      op: "absorbance"
    },
    description: {}
  },
  "fluorescence" : {
    scaffold: {
      op: "fluorescence"
    },
    description: {}
  },
  "luminescence" : {
    scaffold: {
      op: "luminescence"
    },
    description: {}
  },

  "sangerseq": {
    scaffold: {
      op: "sangerseq"
    },
    description: {}
  },

  "spin": {
    scaffold: {
      op: "spin"
    },
    description: {}
  },

  "incubate": {
    scaffold: {
      op: "incubate"
    },
    description: {}
  },

  "gel_separate" : {
    scaffold: {
      op: "gel_separate"
    },
    description: {}
  }

  /*
   //todo - make available only in pipette controller
   "transfer" : {},
   "distribute" : {},
   "consolidate" : {},
   "mix" : {},
   */
});
