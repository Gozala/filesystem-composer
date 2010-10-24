'use strict'

var Trait = require('light-traits').Trait

exports.FSTrait = Trait
( require('./paths').FSPathsTrait
, require('./files').FSFilesTrait
, require('./listing').FSListTrait
)
