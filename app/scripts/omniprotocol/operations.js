var optionEnums = require('./optionEnums.js');

module.exports = {
  //pipetting
  "transfer"  : {
    operation    : "transfer",
    "description": "Transfer contents from one container to another, either 1-to-n or n-to-n",
    "name"       : "Transfer",
    "type"       : "pipette",
    "scaffold"   : {
      "operation"   : "transfer",
      "requirements": {},
      "transforms"  : [
        {
          "wells": "to"
        },
        {
          "wells": "from"
        }
      ],
      "fields"      : [
        {
          "name": "volume",
          "type": "volume"
        },
        {
          "name"           : "from",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name"           : "to",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name"    : "dispense_speed",
          "type"    : "flowrate",
          "optional": true,
          "default" : {"value": 100, "unit": "microliter/second"}
        },
        {
          "name"    : "aspirate_speed",
          "type"    : "flowrate",
          "optional": true,
          "default" : {"value": 100, "unit": "microliter/second"}
        },
        {
          "name"    : "mix_before",
          "type"    : "mixwrap",
          "optional": true,
          "default" : {
            "volume"     : {"value": 10.0, "unit": "microliter"},
            "repetitions": 5,
            "speed"      : {"value": 100, "unit": "microliter/second"}
          }
        },
        {
          "name"    : "mix_after",
          "type"    : "mixwrap",
          "optional": true,
          "default" : {
            "volume"     : {"value": 10.0, "unit": "microliter"},
            "repetitions": 5,
            "speed"      : {"value": 100, "unit": "microliter/second"}
          }
        },
        {
          "name"    : "one_tip",
          "type"    : "boolean",
          "optional": true,
          "default" : false
        }
      ]
    }

  },
  "distribute": {
    "operation"  : "distribute",
    "description": "Distribute liquid from source well(s) to destination wells(s), either 1-to-n, n-to-1, or n-to-n",
    "name"       : "Distribute",
    "type"       : "pipette",
    "scaffold"   : {
      "operation"   : "distribute",
      "requirements": {},
      "transforms"  : [
        {
          "wells": "to"
        },
        {
          "wells": "from"
        }
      ],
      "fields"      : [
        {
          "name": "volume",
          "type": "volume"
        },
        {
          "name": "from",
          "type": "aliquot"
        },
        {
          "name"           : "to",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name"    : "dispense_speed",
          "type"    : "flowrate",
          "optional": true,
          "default" : {"value": 100, "unit": "microliter/second"}
        },
        {
          "name"    : "aspirate_speed",
          "type"    : "flowrate",
          "optional": true,
          "default" : {"value": 100, "unit": "microliter/second"}
        },
        {
          "name"    : "mix_before",
          "type"    : "mixwrap",
          "optional": true,
          "default" : {
            "volume"     : {"value": 10.0, "unit": "microliter"},
            "repetitions": 5,
            "speed"      : {"value": 100, "unit": "microliter/second"}
          }
        }
      ]
    }
  },

  "consolidate": {
    "operation"  : "consolidate",
    "description": "Consolidate contents from multiple wells into one single well.",
    "name"       : "Consolidate",
    "type"       : "pipette",
    "scaffold"   : {
      "operation"   : "consolidate",
      "requirements": {},
      "transforms"  : [
        {
          "wells": "to"
        },
        {
          "wells": "from"
        }
      ],
      "fields"      : [
        {
          "name"   : "volume",
          "type"   : "volume",
          "default": {"value": 10.0, "unit": "microliter"}
        },
        {
          "name"           : "from",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name": "to",
          "type": "aliquot"
        },
        {
          "name"    : "aspirate_speed",
          "type"    : "flowrate",
          "optional": true,
          "default" : {"value": 100, "unit": "microliter/second"}
        },
        {
          "name"    : "dispense_speed",
          "type"    : "flowrate",
          "optional": true,
          "default" : {"value": 100, "unit": "microliter/second"}
        },
        {
          "name"    : "mix_after",
          "type"    : "mixwrap",
          "optional": true,
          "default" : {
            "volume"     : {"value": 10.0, "unit": "microliter"},
            "repetitions": 5,
            "speed"      : {"value": 100, "unit": "microliter/second"}
          }
        }
      ]
    }
  },

  "mix": {
    "operation"  : "mix",
    "description": "Mix specified well using a new pipette tip",
    "name"       : "Mix",
    "type"       : "pipette",
    "scaffold"   : {
      "operation"   : "mix",
      "requirements": {},
      "transforms"  : [
        {
          "wells": "wells"
        }
      ],
      "fields"      : [
        {
          "name"           : "wells",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name"    : "volume",
          "type"    : "volume",
          "optional": true,
          "default" : {"value": 50, "unit": "microliter"}
        },
        {
          "name"    : "speed",
          "type"    : "flowrate",
          "optional": true,
          "default" : {"value": 100, "unit": "microliter/second"}
        },
        {
          "name"    : "repetitions",
          "type"    : "integer",
          "optional": true,
          "default" : 10
        }
      ]
    }
  },

  "dispense": {
    "operation"  : "dispense",
    "description": "Dispense a reagent into columns of a container",
    "name"       : "Dispense",
    "type"       : "pipette",
    "scaffold"   : {
      "operation"   : "dispense",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name": "object",
          "type": "container"
        },
        {
          "name"   : "reagent",
          "type"   : "option",
          "options": optionEnums.reagents.dispense,
          "default": "lb-broth-noAB"
        },
        {
          "name"           : "columns",
          "type"           : "columnVolumes",
          "singleContainer": true
        }
      ]
    }
  },

  "provision": {
    "operation"  : "provision",
    "description": "Dispense a Transcriptic catalog resource into specified wells",
    "name"       : "Provision",
    "type"       : "pipette",
    "scaffold"   : {
      "operation"   : "provision",
      "requirements": {},
      "transforms"  : [
        {
          "wells": "wells"
        }
      ],
      "fields"      : [
        {
          "name"           : "wells",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name"   : "volume",
          "type"   : "volume",
          "default": {"value": 50, "unit": "microliter"}
        },
        {
          "name": "resource",
          "type": "resource"
        }
      ]
    }
  },

  "spread": {
    "operation"  : "spread",
    "description": "Spread the specified volume of the source aliquot across the surface of the agar contained in the object container",
    "name"       : "Spread",
    "type"       : "picking",
    "scaffold"   : {
      "operation"   : "spread",
      "requirements": {},
      "transforms"  : [
        {
          "wells": "from"
        },
        {
          "wells": "to"
        }
      ],
      "fields"      : [
        {
          "name": "from",
          "type": "aliquot"
        },
        {
          "name"    : "to",
          "type"    : "aliquot"
        },
        {
          "name"   : "volume",
          "type"   : "volume",
          "default": {"value": 50, "unit": "microliter"}
        }
      ]
    }
  },

  "autopick": {
    "operation"  : "autopick",
    "description": "Pick at least min_count colonies from 'source' to 'destination' wells, until there are no more colonies available, failing if there are fewer than min_count colonies detected",
    "name"       : "Autopick",
    "type"       : "picking",
    "scaffold"   : {
      "operation"   : "autopick",
      "requirements": {},
      "transforms"  : [
        {
          "wells": "source"
        },
        {
          "wells": "destination"
        }
      ],
      "fields"      : [
        {
          "name": "from",
          "type": "aliquot"
        },
        {
          "name"    : "to",
          "type"    : "aliquot+"
        },
        {
          "name"    : "min_colony_count",
          "readable": "minimum count",
          "type"    : "integer",
          "optional": true
        }
      ]
    }
  },

  //heating


  "thermocycle": {
    "operation"  : "thermocycle",
    "description": "Thermocycle a container, putting through several temperature cycles, e.g. to run a PCR",
    "name"       : "Thermocycle",
    "type"       : "heating",
    "scaffold"   : {
      "operation"   : "thermocycle",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name"    : "dataref",
          "type"    : "string",
          "optional": true,
          "default" : "thermocycle_${unfolded}"
        },
        {
          "name": "object",
          "type": "container"
        },
        {
          "name"   : "volume",
          "type"   : "volume",
          "default": {"value": 10, "unit": "microliter"}
        },
        {
          "name": "groups",
          "type": "thermocycleGroups"
        },
        {
          "name"    : "dyes",
          "type"    : "thermocycleDyes",
          "optional": true
        },
        {
          "name"    : "melting",
          "type"    : "thermocycleMelting",
          "optional": true
        }
      ]
    }
  },

  "incubate": {
    "operation"  : "incubate",
    "description": "keep (cells, bacteria, etc.) at a suitable temperature so that they develop",
    "name"       : "Incubate",
    "type"       : "heating",
    "scaffold"   : {
      "operation"   : "incubate",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name": "object",
          "type": "container"
        },
        {
          "name"   : "where",
          "type"   : "option",
          "options": optionEnums.storage.storage,
          "default": "ambient"
        },
        {
          "name"   : "duration",
          "type"   : "duration",
          "default": {"value": 60, "unit": "minute"}
        },
        {
          "name"        : "co2",
          "type"        : "integer",
          "default"     : 0,
          "optional"    : true,
          "restrictions": {
            "value": {
              "min": 0,
              "max": 100
            }
          }
        },
        {
          "name"   : "shaking",
          "type"   : "boolean",
          "default": false
        }
      ]
    }
  },


  //cover / seal


  "seal": {
    "operation"  : "seal",
    "description": "Seal a container",
    "name"       : "Seal",
    "type"       : "seal",
    "scaffold"   : {
      "operation"   : "seal",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name": "object",
          "type": "container"
        },
        {
          "name"    : "type",
          "type"    : "option",
          "default" : "ultra-clear",
          "optional": true,
          "options" : [
            "ultra-clear",
            "foil"
          ]
        }
      ]
    }
  },

  "unseal": {
    "operation"  : "unseal",
    "description": "Unseal a container",
    "name"       : "Unseal",
    "type"       : "seal",
    "scaffold"   : {
      "operation"   : "unseal",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name": "object",
          "type": "container"
        }
      ]
    }
  },

  "cover": {
    "operation"  : "cover",
    "description": "Cover a plate with a specified lid",
    "name"       : "Cover",
    "type"       : "seal",
    "scaffold"   : {

      "operation"   : "cover",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name": "object",
          "type": "container"
        },
        {
          "name"   : "lid",
          "type"   : "option",
          "options": optionEnums.lid.cover,
          "default": "standard"
        }
      ]
    }
  },

  "uncover": {
    "operation"  : "uncover",
    "description": "Uncover a container",
    "name"       : "Uncover",
    "type"       : "seal",
    "scaffold"   : {
      "operation"   : "uncover",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name": "object",
          "type": "container"
        }
      ]
    }
  },

  "spin": {
    "operation"  : "spin",
    "description": "Centrifuge a plate",
    "name"       : "Spin",
    "type"       : "container",
    "scaffold"   : {
      "operation"   : "spin",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name": "object",
          "type": "container"
        },
        {
          "name"   : "acceleration",
          "type"   : "acceleration",
          "default": "100:meter/second^2"
        },
        {
          "name": "duration",
          "type": "duration"
        }
      ]
    }
  },

  "image_plate": {
    "operation"  : "image_plate",
    "description": "Scan an image of a plate",
    "name"       : "Image Plate",
    "type"       : "container",
    "scaffold"   : {
      "operation"   : "image_plate",
      "requirements": {},
      "transforms"  : [
        {
          "container": "object"
        }
      ],
      "fields"      : [
        {
          "name"   : "dataref",
          "type"   : "string",
          "default": "imagePlate_${unfolded}"
        },
        {
          "name": "object",
          "type": "container"
        },
        {
          "name"   : "mode",
          "type"   : "option",
          "options": ["top", "bottom"],
          "default": "top"
        }
      ]
    }
  },


  //spectrometry


  "absorbance": {
    "operation"  : "absorbance",
    "description": "Measure absorbance of a specified wavelength (between 300 nm - 1000 nm)",
    "name"       : "Absorbance",
    "type"       : "spectrophotometry",
    "scaffold"   : {
      "operation"      : "absorbance",
      "requirements"   : {},
      "transformations": [
        {
          "wells": "wells"
        }
      ],
      "fields"         : [
        {
          "name"   : "dataref",
          "type"   : "string",
          "default": "absorbance_${unfolded}"
        },
        {
          "name"           : "wells",
          "type"           : "aliquot+",
          "singleContainer": true
        },
        {
          "name"        : "wavelength",
          "type"        : "length",
          "default"     : {"value": 600, "unit": "nanometer"},
          "restrictions": {
            "value": {
              "min": 300,
              "max": 1000
            }
          }
        },
        {
          "name"    : "num_flashes",
          "readable": "number flashes",
          "type"    : "integer",
          "optional": true,
          "default" : 25
        }
      ]
    }
  },

  "fluorescence": {
    "operation"  : "fluorescence",
    "description": "Measure fluorescence given an excitation wavelength (300 nm - 1000 nm) and emission (250 nm - 900 nm)",
    "name"       : "Fluorescence",
    "type"       : "spectrophotometry",
    "scaffold"   : {
      "operation"      : "fluorescence",
      "requirements"   : {},
      "transformations": [
        {
          "wells": "wells"
        }
      ],
      "fields"         : [
        {
          "name"   : "dataref",
          "type"   : "string",
          "default": "fluorescence_${unfolded}"
        },
        {
          "name"           : "wells",
          "type"           : "aliquot+",
          "singleContainer": true
        },
        {
          "name"        : "excitation",
          "type"        : "length",
          "default"     : {"value": 600, "unit": "nanometer"},
          "restrictions": {
            "value": {
              "min": 300,
              "max": 1000
            }
          }
        },
        {
          "name"        : "emission",
          "type"        : "length",
          "default"     : {"value": 500, "unit": "nanometer"},
          "restrictions": {
            "value": {
              "min": 250,
              "max": 900
            }
          }
        },
        {
          "name"    : "num_flashes",
          "readable": "number flashes",
          "type"    : "integer",
          "optional": true,
          "default" : 25
        }
      ]
    }
  },

  "luminescence": {
    "operation"  : "luminescence",
    "description": "Measure luminescence in wells of a plate between 380nm - 600 nm",
    "name"       : "Luminescence",
    "type"       : "spectrophotometry",
    "scaffold"   : {
      "operation"      : "luminescence",
      "requirements"   : {},
      "transformations": [
        {
          "wells": "wells"
        }
      ],
      "fields"         : [
        {
          "name"   : "dataref",
          "type"   : "string",
          "default": "luminescence_${unfolded}"
        },
        {
          "name"           : "wells",
          "type"           : "aliquot+",
          "singleContainer": true
        }
      ]
    }
  },


  //DNA stuff

  /*
   "sangerseq"   : {
   "operation": "sangerseq"
   },

   */
  "gel_separate": {
    "operation"  : "gel_separate",
    "description": "Perform a dry gel electrophoresis",
    "name"       : "Gel Separate",
    "type"       : "DNA",
    "scaffold"   : {
      "operation"   : "gel_separate",
      "requirements": {},
      "transforms"  : [
        {
          "wells": "wells"
        }
      ],
      "fields"      : [
        {
          "name"   : "dataref",
          "type"   : "string",
          "default": "gelSeparate_${unfolded}"
        },
        {
          "name"           : "objects",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name"   : "matrix",
          "type"   : "option",
          "options": optionEnums.gel.matrix
        },
        {
          "name"   : "ladder",
          "type"   : "option",
          "options": optionEnums.gel.ladder,
          "default": "ladder1"
        },
        {
          "name"   : "duration",
          "type"   : "duration",
          "default": {"value": 20, "unit": "minute"}
        }
      ]
    }
  },

  //special

  "autoprotocol": {
    "operation"  : "autoprotocol",
    "description": "Type the JSON of an autoprotocol operation manually",
    "name"       : "Autoprotocol",
    "type"       : "special",
    "scaffold"   : {
      "operation"   : "autoprotocol",
      "requirements": {},
      "transforms"  : [],
      "fields"      : [
        {
          "name"   : "json",
          "type"   : "json",
          "default": "{}"
        }
      ]
    }
  }
};