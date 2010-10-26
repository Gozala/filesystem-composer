'use strict'

var Trait = require('light-traits').Trait

exports.FSBaseTrait = Trait
( require('./files').FSFilesTrait
, require('./listing').FSListTrait
, require('./directories').FSDirectoriesTrait
, require('./tests').FSTestsTrait
)

