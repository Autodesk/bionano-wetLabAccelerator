var optionEnums = require('./optionEnums.js');

module.exports = {
  //pipetting
  "transfer"  : {
    operation    : "transfer",
    "description": "Transfer contents from one container to another, either 1-to-n or n-to-n",
    "name"       : "Transfer",
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
          "name"           : "to",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name"           : "from",
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
        }
      ]
    }

  },
  "distribute": {
    "operation"  : "distribute",
    "description": "Distribute liquid from source well(s) to destination wells(s), either 1-to-n, n-to-1, or n-to-n",
    "name"       : "Distribute",
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
          "name"           : "to",
          "type"           : "aliquot+",
          "singleContainer": false
        },
        {
          "name": "from",
          "type": "aliquot"
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
          "name": "to",
          "type": "aliquot"
        },
        {
          "name"           : "from",
          "type"           : "aliquot+",
          "singleContainer": false
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

  "mix"     : {
    "operation"  : "mix",
    "description": "Mix specified well using a new pipette tip",
    "name"       : "Mix",
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
    "scaffold"   : {
      "operation"   : "dispense",
      "requirements": {},
      "transforms"  : [
        {
          "container": "container"
        }
      ],
      "fields"      : [
        {
          "name"   : "reagent",
          "type"   : "option",
          "options": optionEnums.reagents.dispense,
          "value"  : "lb-broth-noAB"
        },
        {
          "name"           : "columns",
          "type"           : "columnVolumes",
          "singleContainer": true
        }
      ]
    }
  },


  //heating


  "thermocycle": {
    "operation"  : "thermocycle",
    "description": "Thermocycle a container, putting through several temperature cycles, e.g. to run a PCR",
    "name"       : "Thermocycle",
    "scaffold"   : {
      "operation"   : "thermocycle",
      "requirements": {},
      "transforms"  : [
        {
          "container": "container"
        }
      ],
      "fields"      : [
        {
          "name"    : "dataref",
          "type"    : "string",
          "optional": true,
          "value"   : "thermocycle_${index}"
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
          "name": "steps",
          "type": "thermocycleGroup"
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
    "description": "",
    "name"       : "Incubate",
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
          "name"    : "object",
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
          "name"    : "lid",
          "type"    : "option",
          "options" : optionEnums.lid.cover,
          "optional": true,
          "default" : "standard"
        }
      ]
    }
  },

  "uncover": {
    "operation"  : "uncover",
    "description": "Uncover a container",
    "name"       : "Uncover",
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


  //spectrometry


  "absorbance": {
    "operation"  : "absorbance",
    "description": "Measure absorbance of a specified wavelength (between 300 nm - 1000 nm)",
    "name"       : "Absorbance",
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
          "default": "absorbance_${index}"
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
          "default": "fluorescence_${index}"
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
          "default": "luminescence_${index}"
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
          "default": "gelSeparate_${index}"
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
          "type"   : "string",
          "default": {"value": 60, "unit": "minute"}
        }
      ]
    }
  },


  //containers


  "store": {
    "operation"  : "store",
    "description": "Deliver a plate to a storage location specified by the where parameter.",
    "name"       : "Store",
    "scaffold"   : {
      "operation"   : "store",
      "requirements": {},
      "transforms"  : [
        {
          "container": "container"
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
        }
      ]
    }
  },

  "discard": {
    "operation"  : "discard",
    "description": "Discard a container. The container will be removed from your inventory and no longer accessible.",
    "name"       : "Discard",
    "scaffold"   : {
      "operation"   : "discard",
      "requirements": {},
      "transforms"  : [
        {
          "container": "container"
        }
      ],
      "fields"      : [
        {
          "name": "object",
          "type": "container"
        }
      ]
    }
  }
};