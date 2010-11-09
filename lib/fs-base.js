'use strict'

var PromisedTrait = require('promised-traits').PromisedTrait

exports.FSBaseTrait = PromisedTrait
( require('./files').FSFilesTrait
, require('./listing').FSListTrait
, require('./directories').FSDirectoriesTrait
, require('./tests').FSTestsTrait
, require('./attributes').FSAttributesTrait
)
