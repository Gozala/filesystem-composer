'use strict'

var PromisedTrait = require('promised-traits').PromisedTrait

exports.FSBaseTrait = PromisedTrait.compose(
  require('./files').FSFilesTrait,
  require('./links').FSLinksTrait,
  require('./listing').FSListTrait,
  require('./directories').FSDirectoriesTrait,
  require('./tests').FSTestsTrait,
  require('./attributes').FSAttributesTrait
)
